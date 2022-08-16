import {
    Publisher,
    QueuesName,
    ExchangesName,
    OrderCreatedEvent,
    ExchangeTypes,
    RoutingKeys,
} from '@vuongtruong97nb/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly exchange = ExchangesName.Orders
    readonly queue = QueuesName.orderCreated_Ticket
    readonly exchangeType = ExchangeTypes.Topic
    readonly routingKey = RoutingKeys.orderCreatedAll
}
