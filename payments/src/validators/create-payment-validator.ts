import { body } from 'express-validator'
import { validateRequest } from '@vuongtruong97nb/common'

export const createPaymentValidator = [
    body('token').not().isEmpty().withMessage('Token is required'),
    body('orderId').not().isEmpty().withMessage('Order Id is required'),
    validateRequest,
]
