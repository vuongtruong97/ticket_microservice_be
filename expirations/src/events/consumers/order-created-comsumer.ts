import {
    Consumer,
    ExchangesName,
    ExchangeTypes,
    OrderCreatedEvent,
    OrderStatus,
    QueuesName,
    RoutingKeys,
} from '@vuongtruong97nb/common'
import { ConsumeMessage, Channel } from 'amqplib'
import { rabbitWrapper } from '../../rabbitmq-wrapper'

import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedConsummer extends Consumer<OrderCreatedEvent> {
    readonly exchange = ExchangesName.Orders
    readonly exchangeType = ExchangeTypes.Topic
    readonly queue = QueuesName.orderCreated_Expiration
    readonly routingKey = RoutingKeys.orderCreatedAll

    async processMsg(
        data: OrderCreatedEvent['data'],
        msg: ConsumeMessage,
        channel: Channel
    ) {
        try {
            const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
            console.log('Order id: ', data.id, 'will expire after ', delay, 'milisecond')
            expirationQueue.add({ orderId: data.id }, { delay: delay })
            channel.ack(msg)
        } catch (error) {
            channel.nack(msg)
            console.error(error)
        }
    }
}
