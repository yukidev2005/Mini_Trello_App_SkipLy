import { db } from '~/index'
import { CreateTaskType, UpdateTaskType } from '~/res/task/task.schema'

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
  // check  valid
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

  return {
    ...data,
    id: newTask.id
  }
}

export const handleUpdateTask = async (data: UpdateTaskType, taskId: string, ownerId: string) => {
  // check  valid
  const task = await db.collection('tasks').doc(taskId).get()

  if (!task.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Task not found')
    error.statusCode = 404
    throw error
  }

  if (!task.data().owner_id !== ownerId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('You do not won task')
    error.statusCode = 401
    throw error
  }

  // create

  await db.collection('tasks').doc(taskId).update({
    board_id: data.boardId,
    card_id: data.cardId,
    title: data.title,
    description: data.description,
    status: data.status
  })

  return {
    ...data
  }
}

export const handleDeleteTask = async (taskId: string, ownerId: string) => {
  // check valid
  const task = await db.collection('tasks').doc(taskId).get()
  if (!task.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('task not found')
    error.statusCode = 404
    throw error
  }

  if (!task.data().owner_id !== ownerId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('You do not won task')
    error.statusCode = 401
    throw error
  }

  await db.collection('tasks').doc(taskId).delete()
  return null
}
  await db.collection('tasks').doc(taskId).delete()
  return null
}
