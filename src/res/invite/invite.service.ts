import { db } from '~/index'
import { transporter } from '~/utils/transporter'
import { SendInviteType, RespondInviteType } from './invite.schema'
import { invitationEmailTemplate } from '~/utils/email-template'
import { createHttpError } from '~/utils/http-error'
import { sendUpdateBoardToRoom } from '~/socket/board-socket'

export const handleSendInvite = async (
  boardId: string,
  payload: SendInviteType
): Promise<{ success: boolean; member_id: string; email: string }> => {
  const targetEmail = payload.email || payload.email_member

  if (!targetEmail) {
    throw createHttpError('Vui lòng nhập email người dùng', 400)
  }

  // Find user by email in users collection
  const userSnapshot = await db.collection('users').where('email', '==', targetEmail).get()
  if (userSnapshot.empty) {
    throw createHttpError('Email không tồn tại trong hệ thống', 404)
  }

  const targetUserDoc = userSnapshot.docs[0]
  const member_id = targetUserDoc.id

  const board = await db.collection('boards').doc(boardId).get()
  const boardData = board.data()
  if (!boardData) {
    throw createHttpError('Board không tồn tại', 404)
  }

  const board_owner_id = payload.board_owner_id || boardData.owner_id || boardData.ownerId || ''

  if (board_owner_id && board_owner_id === member_id) {
    throw createHttpError('Bạn không thể tự mời chính mình', 400)
  }

  const currentMembers: string[] = [...(boardData.member_ids ?? []), ...(boardData.memberIds ?? [])]
  if (currentMembers.includes(member_id)) {
    throw createHttpError('Người dùng này đã là thành viên của bảng', 400)
  }

  const existingInvite = await db
    .collection('invitations')
    .where('board_id', '==', boardId)
    .where('member_id', '==', member_id)
    .where('status', '==', 'pending')
    .get()

  if (!existingInvite.empty) {
    throw createHttpError('Lời mời đã được gửi tới thành viên này trước đó', 409)
  }

  const inviteRef = await db.collection('invitations').add({
    board_id: boardId,
    board_owner_id: board_owner_id || null,
    member_id,
    email_member: targetEmail,
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date()
  })

  let ownerEmail = 'Board Owner'
  if (board_owner_id) {
    const ownerDoc = await db.collection('users').doc(board_owner_id).get()
    if (ownerDoc.exists && ownerDoc.data()?.email) {
      ownerEmail = ownerDoc.data()?.email
    }
  }

  await transporter.sendMail({
    from: `"Skipli Team" <${process.env.GMAIL_USER}>`,
    to: targetEmail,
    subject: 'Bạn được mời tham gia bảng làm việc trên Skipli',
    html: invitationEmailTemplate(boardId, inviteRef.id, ownerEmail)
  })

  return { success: true, member_id, email: targetEmail }
}

export const handleGetPendingInvitations = async (userId: string) => {
  const invitesSnapshot = await db
    .collection('invitations')
    .where('member_id', '==', userId)
    .where('status', '==', 'pending')
    .get()

  if (invitesSnapshot.empty) {
    return []
  }

  const results = await Promise.all(
    invitesSnapshot.docs.map(async (doc) => {
      const data = doc.data()
      let boardName = 'Workspace Board'

      if (data.board_id) {
        const boardDoc = await db.collection('boards').doc(data.board_id).get()
        if (boardDoc.exists && boardDoc.data()?.name) {
          boardName = boardDoc.data()?.name
        }
      }

      return {
        id: doc.id,
        invite_id: doc.id,
        board_id: data.board_id,
        board_name: boardName,
        board_owner_id: data.board_owner_id,
        member_id: data.member_id,
        email_member: data.email_member,
        status: data.status,
        created_at: data.created_at
      }
    })
  )

  return results
}

export const handleRespondInvite = async (
  boardId: string,
  cardId: string,
  payload: RespondInviteType
): Promise<{ success: boolean }> => {
  const { invite_id, member_id, status } = payload

  const inviteDoc = await db.collection('invitations').doc(invite_id).get()
  const inviteData = inviteDoc.data()

  if (!inviteData) {
    throw createHttpError('Invitation not found', 404)
  }

  const targetBoardId = inviteData.board_id || boardId

  if (inviteData.member_id && inviteData.member_id !== member_id) {
    throw createHttpError('Member does not match the invitation', 403)
  }

  if (inviteData.status !== 'pending') {
    throw createHttpError('Invitation has already been responded to', 409)
  }

  await db.collection('invitations').doc(invite_id).update({
    status,
    updated_at: new Date()
  })

  if (status === 'accepted') {
    // 1. Add member_id to board.member_ids AND board.memberIds
    const boardDoc = await db.collection('boards').doc(targetBoardId).get()
    if (boardDoc.exists) {
      const boardData = boardDoc.data()!
      const currentBoardMembers = boardData.ids

      await db
        .collection('boards')
        .doc(targetBoardId)
        .update({
          member_ids: [...currentBoardMembers, payload.member_id]
        })

      sendUpdateBoardToRoom(targetBoardId, {
        ...boardData,
        id: targetBoardId,
        member_ids: currentBoardMembers,
        memberIds: currentBoardMembers
      })
    }

    // 2. If cardId is valid and not 'default', add to card.memberIds
    if (cardId && cardId !== 'default' && cardId !== 'board') {
      const cardDoc = await db.collection('cards').doc(cardId).get()
      if (cardDoc.exists && cardDoc.data()) {
        const currentMembers: string[] = cardDoc.data()?.memberIds ?? []
        if (!currentMembers.includes(member_id)) {
          await db
            .collection('cards')
            .doc(cardId)
            .update({
              memberIds: [...currentMembers, member_id]
            })
        }
      }
    }
  }

  return { success: true }
}
