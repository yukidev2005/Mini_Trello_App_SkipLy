import { db } from '~/index'
import { transporter } from '~/utils/transporter'
import { SendInviteType, RespondInviteType } from './invite.schema'
import { invitationEmailTemplate } from '~/utils/email-template'

export const handleSendInvite = async (boardId: string, payload: SendInviteType): Promise<{ success: boolean }> => {
  const { board_owner_id, member_id, email_member } = payload

  if (board_owner_id === member_id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('You can  not invite youself')
    error.statusCode = 400
    throw error
  }

  const board = await db.collection('boards').doc(boardId).get()
  if (!board.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Board not found')
    error.statusCode = 404
    throw error
  }

  const owner = await db.collection('users').doc(board_owner_id).get()
  if (!owner.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Board owner not found')
    error.statusCode = 404
    throw error
  }

  const member = await db.collection('users').doc(member_id).get()
  if (!member.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Member not found')
    error.statusCode = 404
    throw error
  }

  const existingInvite = await db
    .collection('invitations')
    .where('board_id', '==', boardId)
    .where('member_id', '==', member_id)
    .where('status', '==', 'pending')
    .get()

  if (!existingInvite.empty) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Invitation already sent to this member')
    error.statusCode = 409
    throw error
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

  const invite_id = inviteRef.id

  if (email_member) {
    const ownerData = owner.data()
    const ownerEmail = ownerData?.email ?? 'Board Owner'

    await transporter.sendMail({
      from: `"Skipli Team" <${process.env.GMAIL_USER}>`,
      to: email_member,
      subject: 'Bạn được mời tham gia bảng làm việc trên Skipli',
      html: invitationEmailTemplate(boardId, invite_id, ownerEmail)
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Invitation not found')
    error.statusCode = 404
    throw error
  }

  if (inviteData.board_id !== boardId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Invitation does not belong to this board')
    error.statusCode = 403
    throw error
  }

  if (inviteData.member_id !== member_id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Member does not match the invitation')
    error.statusCode = 403
    throw error
  }

  if (inviteData.status !== 'pending') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Invitation has already been responded to')
    error.statusCode = 409
    throw error
  }

  await db.collection('invitations').doc(invite_id).update({
    status,
    updated_at: new Date()
  })

  if (status === 'accepted') {
    const cardDoc = await db.collection('cards').doc(cardId).get()
    if (cardDoc.data()) {
      const cardData = cardDoc.data()
      const currentMembers: string[] = cardData?.memberIds ?? []

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
