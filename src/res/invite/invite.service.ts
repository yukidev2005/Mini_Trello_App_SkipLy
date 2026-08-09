import { db } from '~/index'
import { transporter } from '~/utils/transporter'
import { SendInviteType, RespondInviteType } from './invite.schema'
import { invitationEmailTemplate } from '~/utils/email-template'
import { createHttpError } from '~/utils/http-error'

export const handleSendInvite = async (boardId: string, payload: SendInviteType): Promise<{ success: boolean }> => {
  const { board_owner_id, member_id, email_member } = payload

  if (board_owner_id === member_id) {
    throw createHttpError('You cannot invite yourself', 400)
  }

  const board = await db.collection('boards').doc(boardId).get()
  if (!board.data()) {
    throw createHttpError('Board not found', 404)
  }

  const owner = await db.collection('users').doc(board_owner_id).get()
  if (!owner.data()) {
    throw createHttpError('Board owner not found', 404)
  }

  const member = await db.collection('users').doc(member_id).get()
  if (!member.data()) {
    throw createHttpError('Member not found', 404)
  }

  const existingInvite = await db
    .collection('invitations')
    .where('board_id', '==', boardId)
    .where('member_id', '==', member_id)
    .where('status', '==', 'pending')
    .get()

  if (!existingInvite.empty) {
    throw createHttpError('Invitation already sent to this member', 409)
  }

  const inviteRef = await db.collection('invitations').add({
    board_id: boardId,
    board_owner_id,
    member_id,
    email_member: email_member ?? null,
    status: 'pending',
    created_at: new Date(),
    updated_at: new Date()
  })

  const inviteId = inviteRef.id

  if (email_member) {
    const ownerEmail: string = owner.data()?.email ?? 'Board Owner'

    await transporter.sendMail({
      from: `"Skipli Team" <${process.env.GMAIL_USER}>`,
      to: email_member,
      subject: 'Bạn được mời tham gia bảng làm việc trên Skipli',
      html: invitationEmailTemplate(boardId, inviteId, ownerEmail)
    })
  }

  return { success: true }
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
