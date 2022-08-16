import Queue from 'bull'
import { ExpirationCompletedPublisher } from '../events/publishers/expiration-completed-publisher'
import { rabbitWrapper } from '../rabbitmq-wrapper'

interface Payload {
    orderId: string
}

// create job queue
export const expirationQueue = new Queue<Payload>('order.expiration', {
    redis: {
        host: 'redis-11890.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
        port: 11890,
        password: 'FIsyZiskiX8d89QN1cDpjLZL1sXtgnLC',
    },
})

expirationQueue.process(async (job) => {
    try {
        console.log(job.data, 'order expiration queue')
        await new ExpirationCompletedPublisher(
            rabbitWrapper.channels.expirationCompletedChannel
        ).publish({ orderId: job.data.orderId })
    } catch (error) {
        console.log(error)
    }
})
