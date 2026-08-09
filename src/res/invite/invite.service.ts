import { db } from '~/index'
import { transporter } from '~/utils/transporter'
import { SendInviteType, RespondInviteType } from './invite.schema'
import { invitationEmailTemplate } from '~/utils/email-template'
import { createHttpError } from '~/utils/http-error'

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

  const currentMembers: string[] = boardData.member_ids ?? boardData.memberIds ?? []
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

  if (inviteData.board_id !== boardId) {
    throw createHttpError('Invitation does not belong to this board', 403)
  }

  if (inviteData.member_id !== member_id) {
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
    const cardDoc = await db.collection('cards').doc(cardId).get()
    if (cardDoc.data()) {
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

  return { success: true }
}
