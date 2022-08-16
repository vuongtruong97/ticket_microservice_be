import {
    Publisher,
    QueuesName,
    ExchangesName,
    OrderCancelledEvent,
    ExchangeTypes,
    RoutingKeys,
} from '@vuongtruong97nb/common'

export class OrderCanceledPublisher extends Publisher<OrderCancelledEvent> {
    readonly exchange = ExchangesName.Orders
    readonly exchangeType = ExchangeTypes.Topic
    readonly queue = QueuesName.orderCancelled_Ticket
    readonly routingKey = RoutingKeys.orderCancelledAll
}
