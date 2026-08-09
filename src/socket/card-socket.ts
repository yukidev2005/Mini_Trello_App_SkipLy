import { io } from '~/index'

export const sendNewCardToRoom = (roomId: string, newCard: any) => {
  io.to(roomId).emit('create-card', newCard)
  io.to(roomId).emit('new-card', newCard)
}

export const sendUpdateCardToRoom = (roomId: string, cardData: any) => {
  io.to(roomId).emit('update-card', cardData)
}

export const sendDeleteCardToRoom = (roomId: string, cardId: string) => {
  io.to(roomId).emit('delete-card', cardId)
}

export const sendTaskChangeToRoom = (roomId: string) => {
  io.to(roomId).emit('task-change', roomId)
}
