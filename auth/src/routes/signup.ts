import express, { Request, Response } from 'express'
import { User } from '../models/User'
import { signupValidator } from '../validators/signup-validator'
import {
    validateRequest,
    BadRequestError,
    DatabaseConnectionError,
} from '@vuongtruong97nb/common'
import { Jsonwebtoken } from '../services/jwt'

const router = express.Router()

router.post(
    '/api/users/signup',
    signupValidator,
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            throw new BadRequestError('Tài khoản đã tồn tại 😥')
        }

        const user = User.build({ email, password })

        const result = await user.save()

        if (!result) {
            console.log('Create user failed')
            throw new DatabaseConnectionError()
        }

        //generate jwt
        const userJwt = Jsonwebtoken.sign({
            id: result._id,
            email: result.email,
        })

        req.session = {
            jwt: userJwt,
        }

        res.status(201).send({
            success: true,
            data: result,
        })
    }
)

export { router as signupRouter }
