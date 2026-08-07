import { Router } from 'express'
import { createBoard, deleteBoard, getBoardbyId, getBoards, updateBoard } from './board.controller'
import { createCard, deleteCard, getCardById, getCards, getCardsByUserId, updateCard } from '~/res/card/card.controller'
import { respondInvite, sendInvite } from '~/res/invite/invite.controller'

export const boardRoute = Router()

boardRoute.post('/', createBoard)
boardRoute.get('/', getBoards)
boardRoute.get('/:id', getBoardbyId)
boardRoute.put('/:id', updateBoard)
boardRoute.delete('/:id', deleteBoard)

boardRoute.get('/:boardId/cards', getCards)
boardRoute.get('/:boardId/cards/:cardId', getCardById)
boardRoute.get('/:boardId/cards/user/:userId', getCardsByUserId)

boardRoute.post('/:boardId/cards', createCard)
boardRoute.put('/:boardId/cards/:cardId', updateCard)
boardRoute.delete('/:boardId/cards/:cardId', deleteCard)

// Invite routes
boardRoute.post('/:boardId/invite', sendInvite)
boardRoute.post('/:boardId/cards/:cardId/invite/accept', respondInvite)
