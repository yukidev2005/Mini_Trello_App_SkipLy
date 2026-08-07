import { db } from '~/index'
import { CreateCardType, UpdateCardType } from './card.schema'

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

  return {
    name,
    description,
    owner_id: onwerId,
    id: card.id
  }
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

export const handleUpdateCard = async (id: string, { description, name, onwerId }: UpdateCardType) => {
  const card = await db.collection('cards').doc(id).get()
  if (!card.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('card not found')
    error.statusCode = 404
    throw error
  }

  // check owner
  if (!card.data().owner_id !== onwerId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('You not onw this card')
    error.statusCode = 401
    throw error
  }
  await db.collection('cards').doc(id).update({
    name,
    description
  })

  return {
    name,
    description,
    id: card.id
  }
}

export const handleDeleteCard = async (id: string, ownerId: string) => {
  const card = await db.collection('cards').doc(id).get()
  if (!card.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('card not found')
    error.statusCode = 404
    throw error
  }

  if (!card.data().owner_id !== ownerId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('You not onw this card')
    error.statusCode = 401
    throw error
  }

  await db.collection('cards').doc(id).delete()

  return {
    message: 'Delete card successfily'
  }
}
