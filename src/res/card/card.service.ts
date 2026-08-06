import { db } from '~/index'
import { CreateCardType } from './card.schema'

export const handleCreateCard = async ({ description, name }: CreateCardType) => {
  // check board is exit
  const cards = await db.collection('cards').where('name', '==', name).get()

  if (!cards.empty) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('card is realy exit.')
    error.statusCode = 400
  }

  //  create new card

  const card = await db.collection('cards').add({
    name,
    description
  })

  return {
    name,
    description,
    id: card.id
  }
}

export const hanldeGetCards = async () => {
  const cards = await db.collection('cards').get()
  return cards.docs.map((data) => {
    return { ...data.data(), id: data.id }
  })
}

export const handleGetCardById = async (id: string) => {
  const card = await db.collection('cards').doc(id).get()

  return {
    ...card.data(),
    id
  }
}

export const handleUpdateCard = async (id: string, { description, name }: { description: string; name: string }) => {
  // check
  const card = await db.collection('cards').doc(id).get()
  if (!card.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('card not found')
    error.statusCode = 404
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

export const handleDeleteCard = async (id: string) => {
  // check
  const board = await db.collection('boards').doc(id).get()
  if (!board.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('board not found')
    error.statusCode = 404
    throw error
  }

  await db.collection('boards').doc(id).delete()

  return {
    message: 'Delete board successfily'
  }
}
