import { ConsumeMessage, Connection } from 'amqplib'
import { Consumer, TicketCreatedEvent, QueuesName } from '@vuongtruong97nb/common'

export class TicketCreatedConsumer extends Consumer<TicketCreatedEvent> {
    readonly queue = QueuesName.TicketCreated

    processMsg = (data: TicketCreatedEvent['data'], msg: ConsumeMessage) => {
        console.log('Event data', data)
        console.log(data.id)
        console.log(data.price)
        console.log(data.userId)
        console.log(data.title)
        if (true) {
            // fif process success return true
            return true // => ack msg
        } else {
            return false
        }
    }
    constructor(connection: Connection) {
        super(connection)
    }
}
