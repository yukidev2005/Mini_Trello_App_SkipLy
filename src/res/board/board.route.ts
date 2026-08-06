import { Router } from 'express'
import { createBoard, deleteBoard, getBoardbyId, getBoards, updateBoard } from './board.controller'

export const boardRoute = Router()

boardRoute.post('/', createBoard)
boardRoute.get('/', getBoards)
boardRoute.get('/:id', getBoardbyId)
boardRoute.put('/:id', updateBoard)
boardRoute.delete('/:id', deleteBoard)
