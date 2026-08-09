import { io } from '~/index'

export const sendNewCardToRoom = (roomId: string, newCard: any) => {
  io.to(roomId).emit('create-card', newCard)
}
