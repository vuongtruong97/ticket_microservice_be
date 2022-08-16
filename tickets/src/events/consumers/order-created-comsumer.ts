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
import { Ticket } from '../../models/Ticket.model'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'
import { rabbitWrapper } from '../../rabbitmq-wrapper'

export class OrderCreatedConsummer extends Consumer<OrderCreatedEvent> {
    readonly exchange = ExchangesName.Orders
    readonly exchangeType = ExchangeTypes.Topic
    readonly queue = QueuesName.orderCreated_Ticket
    readonly routingKey = RoutingKeys.orderCreatedAll

    async processMsg(
        data: OrderCreatedEvent['data'],
        msg: ConsumeMessage,
        channel: Channel
    ) {
        try {
            const ticket = await Ticket.findById(data.ticket.id)
            if (!ticket) {
                throw new Error('Ticket not found')
            }
            ticket.set({ orderId: data.id })
            await ticket.save()

            await new TicketUpdatedPublisher(
                rabbitWrapper.channels.ticketUpdateChannel
            ).publish({
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userId,
                version: ticket.version,
                orderId: ticket.orderId,
            })
            channel.ack(msg)
        } catch (error) {
            channel.nack(msg)
            console.error(error)
        }
    }
}
