import {
    Consumer,
    ExchangesName,
    ExchangeTypes,
    OrderCancelledEvent,
    QueuesName,
    RoutingKeys,
    OrderStatus,
} from '@vuongtruong97nb/common'

import { ConsumeMessage, Channel } from 'amqplib'
import { Order } from '../../models/Order.model'

export class OrderCancelledConsummer extends Consumer<OrderCancelledEvent> {
    readonly exchange = ExchangesName.Orders
    readonly exchangeType = ExchangeTypes.Topic
    readonly queue = QueuesName.orderCancelled_Payment
    readonly routingKey = RoutingKeys.orderCancelledAll

    async processMsg(
        data: OrderCancelledEvent['data'],
        msg: ConsumeMessage,
        channel: Channel
    ) {
        try {
            const order = await Order.findOne({ _id: data.id, version: data.version - 1 })

            if (!order) {
                throw new Error('Order not found')
            }
            order.set({ status: OrderStatus.Cancelled })

            await order.save()

            channel.ack(msg)
        } catch (error) {
            channel.nack(msg)
            console.error(error)
        }
    }
}
