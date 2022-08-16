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

import { createOrderRouter } from './routes/create-order'
import { deleteOrderRouter } from './routes/delete-order'
import { getOrderRouter } from './routes/get-order'
import { listOrderRouter } from './routes/list-orders'

const app = express()

app.set('trust proxy', true) // client’s IP address is in X-Forwarded-For header
app.use(json())

app.use(
    session({
        signed: false,
        secure: process.env.NODE_ENV !== 'test', // true => https only
    })
)
app.use(currentUser)
app.use(requireAuth)

app.use(createOrderRouter)
app.use(deleteOrderRouter)
app.use(getOrderRouter)
app.use(listOrderRouter)

app.all('*', async () => {
    throw new NotFoundError()
})
app.use(errorHandler)

export { app }
