import { io } from '~/index'

export const sendNewCardToRoom = (roomId: string, newBoard: any) => {
  io.to(roomId).emit('create-board', newBoard)
}
