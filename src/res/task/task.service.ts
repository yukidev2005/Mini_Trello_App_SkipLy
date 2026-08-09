import { db } from '~/index'
import { CreateTaskType, UpdateTaskType } from '~/res/task/task.schema'
import { createHttpError } from '~/utils/http-error'
import { sendTaskChangeToRoom } from '~/socket/card-socket'

export const handleGetTasks = async (boardId: string, cardId: string) => {
  const tasks = await db.collection('tasks').where('board_id', '==', boardId).where('card_id', '==', cardId).get()

  const data = tasks.docs.map((task) => {
    return {
      ...task.data(),
      id: task.id
    }
  })

  return data
}

export const handleGetTaskById = async (taskId: string) => {
  const task = await db.collection('tasks').doc(taskId).get()

  return task.data()
}

export const handleCreateTask = async (data: CreateTaskType) => {
  // check valid
  const board = await db.collection('boards').doc(data.boardId).get()

  if (!board.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Board not found')
    error.statusCode = 404
    throw error
  }

  const card = await db.collection('cards').doc(data.cardId).get()

  if (!card.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Card not found')
    error.statusCode = 404
    throw error
  }

  // create
  const newTask = await db.collection('tasks').add({
    board_id: data.boardId,
    card_id: data.cardId,
    owner_id: data.ownerId,
    title: data.title,
    description: data.description,
    status: data.status
  })

  sendTaskChangeToRoom(data.boardId)

  return {
    ...data,
    id: newTask.id
  }
}

export const handleUpdateTask = async (data: UpdateTaskType, taskId: string, ownerId: string) => {
  // check valid
  const task = await db.collection('tasks').doc(taskId).get()
  const taskData = task.data()

  if (!taskData) {
    throw createHttpError('Task not found', 404)
  }

  if (taskData.owner_id !== ownerId) {
    throw createHttpError('You do not own this task', 403)
  }

  await db.collection('tasks').doc(taskId).update({
    board_id: data.boardId,
    card_id: data.cardId,
    title: data.title,
    description: data.description,
    status: data.status
  })

  sendTaskChangeToRoom(data.boardId)

  return {
    ...data,
    id: taskId
  }
}

export const handleDeleteTask = async (taskId: string, ownerId: string) => {
  // check valid
  const task = await db.collection('tasks').doc(taskId).get()
  const taskData = task.data()

  if (!taskData) {
    throw createHttpError('Task not found', 404)
  }

  if (taskData.owner_id !== ownerId) {
    throw createHttpError('You do not own this task', 403)
  }

  await db.collection('tasks').doc(taskId).delete()

  if (taskData.board_id) {
    sendTaskChangeToRoom(taskData.board_id)
  }

  return null
}
