import { db } from '~/index'
import { AssignType } from '~/res/assign/assign.schema'

export const handleAssign = async ({ memberId, taskId, userId }: AssignType) => {
  const task = await db.collection('tasks').doc(taskId).get()

  if (!task.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Task not found ')
    error.statusCode = 404
    throw error
  }

  if (task.data().owner_id !== userId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('You are not owner this task')
    error.statusCode = 401
    throw error
  }
  const member = await db.collection('users').doc(memberId).get()

  if (!member.data()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('Member  not found')
    error.statusCode = 404
    throw error
  }

  const currentMemberList = task.data().member_ids

  if (currentMemberList.includes(memberId)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error('User already assign ')
    error.statusCode = 409
    throw error
  }
  await db
    .collection('tasks')
    .doc(taskId)
    .update({
      member_ids: [...currentMemberList, memberId]
    })

  return {
    memberId,
    taskId
  }
}

export const handleGetAssignInCard = async (taskId: string) => {
  const task = await db.collection('tasks').doc(taskId).get()

  if (!task.data()) {
    const error: any = new Error('Task not found')
    error.statusCode = 404
    throw error
  }

  const memberIds: string[] = task.data().member_ids ?? []

  return memberIds.map((memberId) => ({ taskId, memberId }))
}

export const handleDeleteAssign = async ({
  memberId,
  ownerId,
  taskId
}: {
  memberId: string
  ownerId: string
  taskId: string
}) => {
  // check task
  const task = await db.collection('tasks').doc(taskId).get()

  if (!task.data()) {
    const error: any = new Error('Task not found')
    error.statusCode = 404
    throw error
  }

  // check  authro

  if (task.data().owner_id !== ownerId) {
    const error: any = new Error('Task not owner this task')
    error.statusCode = 401
    throw error
  }

  const newMemberId = task.data().member_ids.filter((member_id) => member_id !== memberId)

  await db.collection('tasks').doc(taskId).update({
    member_ids: newMemberId
  })
  return null
}
