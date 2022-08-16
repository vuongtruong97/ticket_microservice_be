import * as http from 'http'
import mongoose from 'mongoose'
import { rabbitWrapper } from './rabbitmq-wrapper'
import { TicketCreatedConsumer } from './events/consumers/ticket-created-consumer'
import { TicketUpdatedConsumer } from './events/consumers/ticket-updated-consummer'
import { ExpirationCompletedConsumer } from './events/consumers/expiration-completed-comsumer'
import { PaymentCreatedListener } from './events/consumers/payment-created-listener'
import { app } from './app'

let server: http.Server

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not define')
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not define')
    }

    if (!process.env.RABBIT_URI) {
        throw new Error('RABBIT_URI is not define')
    }

    try {
        console.log('Starting server...')

        await rabbitWrapper.createConnection(process.env.RABBIT_URI + '?heartbeat=60')

        await mongoose.connect(process.env.MONGO_URI) // change to other db on product 😉
        console.log('[MONGODB] Connected')

        await new TicketCreatedConsumer(rabbitWrapper.consummerConnection).listen()
        await new TicketUpdatedConsumer(rabbitWrapper.consummerConnection).listen()
        await new ExpirationCompletedConsumer(rabbitWrapper.consummerConnection).listen()
        await new PaymentCreatedListener(rabbitWrapper.consummerConnection).listen()
        server = app.listen(3000, () => {
            console.log('Orders service run on port 3000 😎')
        })
    } catch (error: any) {
        console.log(error.message)
        console.log('Restarting server...')
        setTimeout(() => {
            start()
        }, 2000)
    }
}

start()

// graceful - shutdown
const shutdown = () => {
    console.info('SIGTERM signal received.')
    // Stop new requests from client
    console.log('Closing http server.')
    server.close(async () => {
        console.log('Http server closed.')
        // boolean means [force], see in mongoose doc
        mongoose.connection.close(false, () => {
            console.log('MongoDb connection closed...')
        })
        await rabbitWrapper.consummerConnection.close()
        await rabbitWrapper.publishConnection.close()

        process.exit(0) // 0 mean exit with success code, 1 => failure code
    })
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
