import express from 'express'
import 'express-async-errors' // handle async await error without next(err) cb
import session from 'cookie-session'
import { json } from 'body-parser'

import { NotFoundError, errorHandler, currentUser } from '@vuongtruong97nb/common'

import { createTicketRouter } from './routes/create-ticket'
import { getTicketById } from './routes/get-one-ticket'
import { listTicketRouter } from './routes/list-tickets'
import { updateTicketById } from './routes/update-ticket'

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

app.use(createTicketRouter)
app.use(getTicketById)
app.use(listTicketRouter)
app.use(updateTicketById)

app.all('*', async () => {
    throw new NotFoundError()
})
app.use(errorHandler)

export { app }
