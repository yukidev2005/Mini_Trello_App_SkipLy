import { db } from '~/index'
import { AssignType } from '~/res/assign/assign.schema'
import { createHttpError } from '~/utils/http-error'

type DeleteAssignPayload = {
  memberId: string
  ownerId: string
  taskId: string
}

export const handleAssign = async ({ memberId, taskId, userId }: AssignType) => {
  const taskDoc = await db.collection('tasks').doc(taskId).get()
  const taskData = taskDoc.data()

  if (!taskData) {
    throw createHttpError('Task not found', 404)
  }

  if (taskData.owner_id !== userId) {
    throw createHttpError('You are not the owner of this task', 403)
  }

  const memberDoc = await db.collection('users').doc(memberId).get()

  if (!memberDoc.data()) {
    throw createHttpError('Member not found', 404)
  }

  const currentMemberList: string[] = taskData.member_ids ?? []

  if (currentMemberList.includes(memberId)) {
    throw createHttpError('User is already assigned to this task', 409)
  }

  await db
    .collection('tasks')
    .doc(taskId)
    .update({
      member_ids: [...currentMemberList, memberId]
    })

  return { memberId, taskId }
}

export const handleGetAssignInCard = async (taskId: string) => {
  const taskDoc = await db.collection('tasks').doc(taskId).get()
  const taskData = taskDoc.data()

  if (!taskData) {
    throw createHttpError('Task not found', 404)
  }

  const memberIds: string[] = taskData.member_ids ?? []

  return memberIds.map((memberId) => ({ taskId, memberId }))
}

export const handleDeleteAssign = async ({ memberId, ownerId, taskId }: DeleteAssignPayload) => {
  const taskDoc = await db.collection('tasks').doc(taskId).get()
  const taskData = taskDoc.data()

  if (!taskData) {
    throw createHttpError('Task not found', 404)
  }

  if (taskData.owner_id !== ownerId) {
    throw createHttpError('You are not the owner of this task', 403)
  }

  const newMemberIds: string[] = taskData.member_ids.filter((id: string) => id !== memberId)

  await db.collection('tasks').doc(taskId).update({ member_ids: newMemberIds })
  return null
}
