import {
    Publisher,
    QueuesName,
    ExchangesName,
    TicketCreatedEvent,
    ExchangeTypes,
    RoutingKeys,
} from '@vuongtruong97nb/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly exchange = ExchangesName.Tickets
    readonly queue = QueuesName.ticketCreated_Order
    readonly exchangeType = ExchangeTypes.Topic
    readonly routingKey = RoutingKeys.ticketCreatedAll
}
