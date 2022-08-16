import {
    Publisher,
    QueuesName,
    ExchangesName,
    ExpirationCompletedEvent,
    ExchangeTypes,
    RoutingKeys,
} from '@vuongtruong97nb/common'

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
    readonly exchange = ExchangesName.Expirations
    readonly queue = QueuesName.expirationCompleted_Order
    readonly exchangeType = ExchangeTypes.Topic
    readonly routingKey = RoutingKeys.expirationCompletedAll
}
