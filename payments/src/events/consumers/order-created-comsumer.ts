import {
    Consumer,
    ExchangesName,
    ExchangeTypes,
    OrderCreatedEvent,
    QueuesName,
    RoutingKeys,
} from '@vuongtruong97nb/common'
import { ConsumeMessage, Channel } from 'amqplib'
import { rabbitWrapper } from '../../rabbitmq-wrapper'
import { Order } from '../../models/Order.model'

export class OrderCreatedConsummer extends Consumer<OrderCreatedEvent> {
    readonly exchange = ExchangesName.Orders
    readonly exchangeType = ExchangeTypes.Topic
    readonly queue = QueuesName.orderCreated_Payment
    readonly routingKey = RoutingKeys.orderCreatedAll

    async processMsg(
        data: OrderCreatedEvent['data'],
        msg: ConsumeMessage,
        channel: Channel
    ) {
        try {
            const order = Order.build({
                id: data.id,
                userId: data.userId,
                status: data.status,
                price: data.ticket.price,
                version: data.version,
            })

            await order.save()

            channel.ack(msg)
        } catch (error) {
            channel.nack(msg)
            console.error(error)
        }
    }
}
