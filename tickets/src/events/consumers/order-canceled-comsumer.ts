import {
    Consumer,
    OrderCancelledEvent,
    QueuesName,
    RoutingKeys,
    ExchangesName,
    ExchangeTypes,
} from '@vuongtruong97nb/common'
import { ConsumeMessage, Channel } from 'amqplib'
import { Ticket } from '../../models/Ticket.model'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'
import { rabbitWrapper } from '../../rabbitmq-wrapper'

export class OrderCanceledConsumer extends Consumer<OrderCancelledEvent> {
    readonly queue = QueuesName.orderCancelled_Ticket
    readonly routingKey = RoutingKeys.orderCancelledAll
    readonly exchange = ExchangesName.Orders
    readonly exchangeType = ExchangeTypes.Topic
    async processMsg(
        data: OrderCancelledEvent['data'],
        msg: ConsumeMessage,
        channel: Channel
    ): Promise<void> {
        try {
            const ticket = await Ticket.findById(data.ticket.id)

            if (!ticket) {
                throw new Error('Ticket not found!')
            }
            ticket.set({ orderId: null })
            await ticket.save()
            await new TicketUpdatedPublisher(
                rabbitWrapper.channels.ticketUpdateChannel
            ).publish({
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                version: ticket.version,
                orderId: ticket.orderId,
                userId: ticket.userId,
            })

            channel.ack(msg)
        } catch (error) {
            console.log(error)
            channel.nack(msg)
        }
    }
}
