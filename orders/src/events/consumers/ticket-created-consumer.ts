import { ConsumeMessage, Connection, Channel } from 'amqplib'
import {
    Consumer,
    TicketCreatedEvent,
    QueuesName,
    ExchangesName,
    ExchangeTypes,
    RoutingKeys,
} from '@vuongtruong97nb/common'
import { Ticket } from '../../models/Ticket.model'

export class TicketCreatedConsumer extends Consumer<TicketCreatedEvent> {
    readonly queue = QueuesName.ticketCreated_Order
    readonly exchange = ExchangesName.Tickets
    readonly exchangeType = ExchangeTypes.Topic
    readonly routingKey = RoutingKeys.ticketCreatedAll

    async processMsg(
        data: TicketCreatedEvent['data'],
        msg: ConsumeMessage,
        channel: Channel
    ) {
        try {
            const { title, price, id } = data

            const ticket = Ticket.build({
                id,
                title,
                price,
            })
            await ticket.save()
            console.log(ticket)
            channel.ack(msg)
        } catch (error) {
            console.log(error)
            channel.nack(msg)
        }
    }
}
