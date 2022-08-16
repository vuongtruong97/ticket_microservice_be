import { body } from 'express-validator'
import { validateRequest } from '@vuongtruong97nb/common'

export const createTicketValidator = [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    validateRequest,
]
