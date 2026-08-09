import { db } from '~/index'
import { CreateBoardType, UpdateBoardType } from './board.schema'
import { sendNewBoardToRoom, sendUpdateBoardToRoom, sendDeleteBoardToRoom } from '~/socket/board-socket'
import { createHttpError } from '~/utils/http-error'

export const handleCreateBoard = async ({ description, name, userId }: CreateBoardType) => {
  // check board is exit
  const boards = await db.collection('boards').where('name', '==', name).get()

  if (!boards.empty) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('board is realy exit.')
    error.statusCode = 400
  }

  //  create new board
  const board = await db.collection('boards').add({
    name,
    description,
    owner_id: userId,
    member_ids: [userId]
  })

  const newBoardData = {
    name,
    description,
    owner_id: userId,
    id: board.id,
    member_ids: [userId]
  }

  sendNewBoardToRoom(newBoardData)

  return newBoardData
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

export const handleGetMembersByBoardId = async (boardId: string) => {
  const board = await db.collection('boards').doc(boardId).get()
  const boardData = board.data()

  if (!boardData) {
    throw createHttpError('Board not found', 404)
  }

  const memberIds: string[] = boardData.member_ids ?? boardData.memberIds ?? []
  const ownerId = boardData.owner_id || boardData.ownerId
  if (ownerId && !memberIds.includes(ownerId)) {
    memberIds.push(ownerId)
  }

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

export const handleUpdateBoard = async (id: string, { description, name, userId }: UpdateBoardType) => {
  const boardDoc = await db.collection('boards').doc(id).get()
  const boardData = boardDoc.data()

  if (!boardData) {
    throw createHttpError('Board not found', 404)
  }

  if (boardData.owner_id !== userId && boardData.ownerId !== userId) {
    throw createHttpError('You do not own this board', 403)
  }

  await db.collection('boards').doc(id).update({
    name,
    description
  })

  const updatedData = {
    name,
    description,
    id: boardDoc.id
  }

  sendUpdateBoardToRoom(id, updatedData)

  return updatedData
}

export const handleDeleteBoard = async (id: string, userId: string) => {
  const boardDoc = await db.collection('boards').doc(id).get()
  const boardData = boardDoc.data()

  if (!boardData) {
    throw createHttpError('Board not found', 404)
  }

  if (boardData.owner_id !== userId && boardData.ownerId !== userId) {
    throw createHttpError('You do not own this board', 403)
  }

  const cardsList = await db.collection('cards').where('board_id', '==', id).get()

  if (!cardsList.empty) {
    for (let i = 0; i < cardsList.docs.length; i++) {
      const currentCard = cardsList.docs[i]

      // check task link to this card
      const taskList = await db.collection('tasks').where('card_id', '==', currentCard.id).get()

      if (!taskList.empty) {
        for (let j = 0; j < taskList.docs.length; j++) {
          const currentTask = taskList.docs[j]
          await db.collection('tasks').doc(currentTask.id).delete()
        }
      }
      await db.collection('cards').doc(currentCard.id).delete()
    }
  }

  await db.collection('boards').doc(id).delete()
  sendDeleteBoardToRoom(id)

  return null
}
