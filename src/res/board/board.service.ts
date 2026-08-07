import { db } from '~/index'
import { CreateBoardType, UpdateBoardType } from './board.schema'

export const handleCreateBoard = async ({ description, name, userId }: CreateBoardType) => {
  // check board is exit
  const boards = await db.collection('boards').where('name', '==', name).get()

  if (!boards.empty) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('board is realy exit.')
    error.statusCode = 400
  }

  //  create new boar

  const board = await db.collection('boards').add({
    name,
    description,
    owner_id: userId
  })

  return {
    name,
    description,
    owner_id: userId,
    id: board.id
  }
}

export const hanldeGetBoards = async () => {
  const boards = await db.collection('boards').get()
  return boards.docs.map((data) => {
    return { ...data.data(), id: data.id }
  })
}

export const getBoardById = async (id: string) => {
  const board = await db.collection('boards').doc(id).get()

  return {
    ...board.data(),
    id
  }
}

export const handleUpdateBoard = async (id: string, { description, name, userId }: UpdateBoardType) => {
  // check
  const board = await db.collection('boards').doc(id).get()

  if (board) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('board not found')
    error.statusCode = 404
    throw error
  }
  if (board.data().owner_id !== userId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('You not onw this board')
    error.statusCode = 401
    throw error
  }
  await db.collection('boards').doc(id).update({
    name,
    description
  })

  return {
    name,
    description,
    id: board.id
  }
}

export const handleDeleteBoard = async (id: string, userId: string) => {
  // check
  const board = await db.collection('boards').doc(id).get()
  if (!board.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('board not found')
    error.statusCode = 404
    throw error
  }
  if (board.data().owner_id !== userId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('You not onw this board')
    error.statusCode = 401
    throw error
  }

  await db.collection('boards').doc(id).delete()

  return {
    message: 'Delete board successfily'
  }
}
