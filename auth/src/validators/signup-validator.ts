import { body } from 'express-validator'

export const signupValidator = [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 16 })
        .withMessage('Password must be between 4 and 16 characters'),
]
