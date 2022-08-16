import {
    Publisher,
    QueuesName,
    ExchangesName,
    TicketUpdatedEvent,
    ExchangeTypes,
    RoutingKeys,
} from '@vuongtruong97nb/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly exchange = ExchangesName.Tickets
    readonly queue = QueuesName.ticketUpdated_Order
    readonly exchangeType = ExchangeTypes.Topic
    readonly routingKey = RoutingKeys.ticketUpdatedAll
}
