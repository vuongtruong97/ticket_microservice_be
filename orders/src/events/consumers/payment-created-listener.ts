import { ConsumeMessage, Connection, Channel } from 'amqplib'
import {
    Consumer,
    PaymentCreatedEvent,
    QueuesName,
    OrderStatus,
    ExchangesName,
    ExchangeTypes,
    RoutingKeys,
} from '@vuongtruong97nb/common'
import { Order } from '../../models/Order.model'

export class PaymentCreatedListener extends Consumer<PaymentCreatedEvent> {
    readonly queue = QueuesName.ticketCreated_Order
    readonly exchange = ExchangesName.Payments
    readonly exchangeType = ExchangeTypes.Topic
    readonly routingKey = RoutingKeys.paymentCreatedAll

    async processMsg(
        data: PaymentCreatedEvent['data'],
        msg: ConsumeMessage,
        channel: Channel
    ) {
        try {
            const order = await Order.findById(data.orderId)

            if (!order) {
                throw new Error('Order not found')
            }

            order.set({
                status: OrderStatus.Completed,
            })
            await order.save()
            channel.ack(msg)
        } catch (error) {
            console.log(error)
            channel.nack(msg)
        }
    }
}
