import { db } from '~/index'
import { CreateCardType, UpdateCardType } from './card.schema'
import { sendNewCardToRoom, sendUpdateCardToRoom, sendDeleteCardToRoom } from '~/socket/card-socket'

export const handleCreateCard = async ({ description, name, onwerId }: CreateCardType, boardId: string) => {
  const cards = await db.collection('cards').where('name', '==', name).where('boardId', '==', boardId).get()

  if (!cards.empty) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('card is realy exit.')
    error.statusCode = 400
    throw error
  }

  const card = await db.collection('cards').add({
    name,
    description,
    boardId,
    owner_id: onwerId
  })

  const cardData = {
    name,
    description,
    boardId,
    owner_id: onwerId,
    id: card.id
  }

  sendNewCardToRoom(boardId, cardData)

  return cardData
}

export const hanldeGetCards = async (boardId: string) => {
  const cards = await db.collection('cards').where('boardId', '==', boardId).get()
  return cards.docs.map((data) => {
    return { ...data.data(), id: data.id }
  })
}

export const handleGetCardById = async (cardId: string, boardId: string) => {
  const card = await db.collection('cards').doc(cardId).get()

  if (!card.data() || card.data()?.boardId !== boardId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('card not found')
    error.statusCode = 404
    throw error
  }

  return { ...card.data(), id: card.id }
}

export const handleGetCardsByUserId = async (userId: string) => {
  const cards = await db.collection('cards').where('memberIds', 'array-contains', userId).get()

  if (cards.empty) {
    return []
  }

  return cards.docs.map((card) => {
    return { ...card.data(), id: card.id }
  })
}

export const handleGetMembersByCardId = async (cardId: string, boardId?: string) => {
  const card = await db.collection('cards').doc(cardId).get()
  const cardData = card.data()

  if (!cardData || (boardId && cardData.boardId !== boardId)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('card not found')
    error.statusCode = 404
    throw error
  }

  const memberIds: string[] = cardData.memberIds ?? cardData.member_ids ?? []

  if (memberIds.length === 0) {
    return []
  }

  const userDocs = await Promise.all(memberIds.map((id) => db.collection('users').doc(id).get()))

  return userDocs
    .filter((doc) => doc.exists)
    .map((doc) => {
      const data = doc.data()!
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { verificationCode, codeExpiresAt, ...safeUser } = data
      return { id: doc.id, ...safeUser }
    })
}

export const handleUpdateCard = async (id: string, { description, name, onwerId }: UpdateCardType) => {
  const cardDoc = await db.collection('cards').doc(id).get()
  const cardData = cardDoc.data()
  if (!cardData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('card not found')
    error.statusCode = 404
    throw error
  }

  // check owner
  if (cardData.owner_id !== onwerId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('You not onw this card')
    error.statusCode = 401
    throw error
  }
  await db.collection('cards').doc(id).update({
    name,
    description
  })

  const updatedData = {
    name,
    description,
    id: cardDoc.id,
    boardId: cardData.boardId
  }

  if (cardData.boardId) {
    sendUpdateCardToRoom(cardData.boardId, updatedData)
  }

  return updatedData
}

export const handleDeleteCard = async (id: string, ownerId: string) => {
  const cardDoc = await db.collection('cards').doc(id).get()
  const cardData = cardDoc.data()
  if (!cardData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('card not found')
    error.statusCode = 404
    throw error
  }

  if (cardData.owner_id !== ownerId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('You not onw this card')
    error.statusCode = 401
    throw error
  }

  const tasks = await db.collection('tasks').where('card_id', '==', id).get()

  if (!tasks.empty) {
    for (let i = 0; i < tasks.docs.length; i++) {
      const currentTask = tasks.docs[i]
      await db.collection('tasks').doc(currentTask.id).delete()
    }
  }

  await db.collection('cards').doc(id).delete()

  if (cardData.boardId) {
    sendDeleteCardToRoom(cardData.boardId, id)
  }

  return null
}
