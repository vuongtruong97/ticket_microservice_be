import { body } from 'express-validator'
import { validateRequest } from '@vuongtruong97nb/common'

export const createOrderValidator = [
    body('ticketId')
        .not()
        .isEmpty()
        .withMessage('Ticket id is required')
        .isMongoId()
        .withMessage('Ticket id not correct'),
    validateRequest,
]
