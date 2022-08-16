import { ConsumeMessage, Connection, Channel } from 'amqplib'
import {
    Consumer,
    ExpirationCompletedEvent,
    QueuesName,
    ExchangesName,
    ExchangeTypes,
    RoutingKeys,
    OrderStatus,
} from '@vuongtruong97nb/common'
import { Order } from '../../models/Order.model'
import { OrderCanceledPublisher } from '../../events/publishers/order-cancelled-publisher'
import { rabbitWrapper } from '../../rabbitmq-wrapper'

export class ExpirationCompletedConsumer extends Consumer<ExpirationCompletedEvent> {
    readonly queue = QueuesName.expirationCompleted_Order
    readonly exchange = ExchangesName.Expirations
    readonly exchangeType = ExchangeTypes.Topic
    readonly routingKey = RoutingKeys.expirationCompletedAll

    async processMsg(
        data: ExpirationCompletedEvent['data'],
        msg: ConsumeMessage,
        channel: Channel
    ) {
        try {
            const { orderId } = data

            const order = await Order.findById(orderId).populate('ticket')

            if (!order) {
                throw new Error('Order not found')
            }

            if (order.status === OrderStatus.Completed) {
                return channel.ack(msg)
            }

            order.set({ status: OrderStatus.Cancelled })
            await order.save()

            await new OrderCanceledPublisher(
                rabbitWrapper.channels.orderUpdateChannel
            ).publish({
                id: order.id,
                ticket: { id: order.ticket.id },
                version: order.version,
            })

            channel.ack(msg)
        } catch (error) {
            console.log(error)
        }
    }
    constructor(connection: Connection) {
        super(connection)
    }
}
