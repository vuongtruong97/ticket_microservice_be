import { rabbitWrapper } from './rabbitmq-wrapper'
import { OrderCreatedConsummer } from './events/consumers/order-created-comsumer'

const start = async () => {
    if (!process.env.RABBIT_URI) {
        throw new Error('RABBIT_URI is not define')
    }

    try {
        await rabbitWrapper.createConnection(process.env.RABBIT_URI + '?heartbeat=60')

        // start consumers
        await new OrderCreatedConsummer(rabbitWrapper.consummerConnection).listen()
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
const shutdown = async () => {
    console.info('SIGTERM signal received.')
    // Stop new requests from client
    console.log('Closing http server.')

    await rabbitWrapper.cancelConnection()
    process.exit(0) // 0 mean exit with success code, 1 => failure code
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)
