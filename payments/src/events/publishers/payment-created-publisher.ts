import {
    Publisher,
    PaymentCreatedEvent,
    ExchangesName,
    QueuesName,
    ExchangeTypes,
    RoutingKeys,
} from '@vuongtruong97nb/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly exchange = ExchangesName.Payments
    readonly queue = QueuesName.paymentCreated_Order
    readonly exchangeType = ExchangeTypes.Topic
    readonly routingKey = RoutingKeys.paymentCreatedAll
}
