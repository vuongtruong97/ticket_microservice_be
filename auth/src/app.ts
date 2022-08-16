import express from 'express'
import 'express-async-errors' // handle async await error without next(err) cb
import session from 'cookie-session'
import { json } from 'body-parser'

import { signupRouter } from './routes/signup'
import { signinRouter } from './routes/signin'
import { currentUserRouter } from './routes/currentuser'
import { signoutRouter } from './routes/signout'

import { errorHandler } from '@vuongtruong97nb/common'
import { NotFoundError } from '@vuongtruong97nb/common'

const app = express()

app.set('trust proxy', true) // client’s IP address is in X-Forwarded-For header
app.use(json())

app.use(
    session({
        signed: false,
        secure: process.env.NODE_ENV !== 'test', // true => https only
    })
)

app.use(signupRouter)
app.use(signinRouter)
app.use(currentUserRouter)
app.use(signoutRouter)

app.all('*', async () => {
    throw new NotFoundError()
})
app.use(errorHandler)

export { app }
