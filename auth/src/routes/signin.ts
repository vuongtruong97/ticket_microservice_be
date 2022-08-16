import express, { Request, Response } from 'express'
import { User } from '../models/User'
import { signinValidator } from '../validators/signin-validator'
import { validateRequest, BadRequestError } from '@vuongtruong97nb/common'

import { Password } from '../services/password'
import { Jsonwebtoken } from '../services/jwt'

const router = express.Router()

router.post(
    '/api/users/signin',
    signinValidator,
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body

        const existedUser = await User.findOne({ email })

        if (!existedUser) {
            throw new BadRequestError('Thông tin đăng nhập không chính xác !')
        }

        const isMatch = await Password.comparePassword(password, existedUser.password)

        if (!isMatch) {
            throw new BadRequestError('Thông tin đăng nhập không chính xác !')
        }

        const userJwt = Jsonwebtoken.sign({
            id: existedUser._id,
            email: existedUser.email,
        })

        // store it in to a session object, only https
        req.session = {
            jwt: userJwt,
        }

        res.status(200).send({
            success: true,
            data: existedUser,
        })
    }
)

export { router as signinRouter }
