import express from 'express'
import 'express-async-errors' // handle async await error without next(err) cb
import session from 'cookie-session'
import { json } from 'body-parser'

import {
    NotFoundError,
    errorHandler,
    currentUser,
    requireAuth,
} from '@vuongtruong97nb/common'

import { createPaymentRouter } from './routes/create-payment'

const app = express()

app.set('trust proxy', true) // client’s IP address is in X-Forwarded-For header
app.use(json())

app.use(
    session({
        signed: false,
        secure: process.env.NODE_ENV !== 'test', // true => https only
    })
)
app.use(requireAuth)
app.use(currentUser)

app.use(createPaymentRouter)

app.all('*', async () => {
    throw new NotFoundError()
})
app.use(errorHandler)

export { app }
