import { io } from '~/index'

export const sendNewBoardToRoom = (newBoard: any) => {
  io.emit('create-board', newBoard)
}

export const sendUpdateBoardToRoom = (boardId: string, boardData: any) => {
  io.emit('update-board', boardData)
  io.to(boardId).emit('update-board', boardData)
}

export const sendDeleteBoardToRoom = (boardId: string) => {
  io.emit('delete-board', boardId)
  io.to(boardId).emit('delete-board', boardId)
}
