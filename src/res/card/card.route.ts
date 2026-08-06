import { Router } from 'express'
import { createCard, deleteCard, getCardById, getCards, updateCard } from './card.controller'

export const cardRoute = Router()
cardRoute.post('/', createCard)
cardRoute.get('/', getCards)
cardRoute.get('/:id', getCardById)
cardRoute.put('/:id', updateCard)
cardRoute.delete('/:id', deleteCard)
