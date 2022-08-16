import { ConsumeMessage, Connection, Channel } from 'amqplib'
import {
    Consumer,
    TicketUpdatedEvent,
    QueuesName,
    ExchangesName,
    ExchangeTypes,
    RoutingKeys,
} from '@vuongtruong97nb/common'
import { Ticket } from '../../models/Ticket.model'

export class TicketUpdatedConsumer extends Consumer<TicketUpdatedEvent> {
    readonly queue = QueuesName.ticketUpdated_Order
    readonly exchange = ExchangesName.Tickets
    readonly exchangeType = ExchangeTypes.Topic
    readonly routingKey = RoutingKeys.ticketUpdatedAll

    async processMsg(
        data: TicketUpdatedEvent['data'],
        msg: ConsumeMessage,
        channel: Channel
    ) {
        try {
            const { title, price, orderId } = data

            const ticket = await Ticket.findByIdAndPreVersion(data)

            if (!ticket) {
                throw new Error(
                    '[TICKET-UPDATED-EVENT:ORDERS-SERVICE] Ticket not found! OCC'
                )
            }

            ticket.set({ title, price, orderId })
            await ticket.save()
            channel.ack(msg)
        } catch (error) {
            channel.nack(msg, false, true)
            console.log(msg)
            console.log(error)
        }
    }
}
