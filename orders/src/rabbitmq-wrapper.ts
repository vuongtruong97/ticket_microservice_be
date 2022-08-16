import amqplib, { Connection, Options, Channel } from 'amqplib'

// singleton class
class RabbitWrapper {
    private _puhlishConnection?: Connection // underscore and question mark => this prop might be undefinded for some  periods of time
    private _consummerConnection?: Connection

    // channel
    private _orderCreatedChannel?: Channel
    private _orderUpdatedChannel?: Channel

    //geter
    get publishConnection() {
        if (!this._puhlishConnection) {
            throw new Error('Cannot access rabbitmq connection before connecting')
        }
        return this._puhlishConnection
    }

    get consummerConnection() {
        if (!this._consummerConnection) {
            throw new Error('Cannot access rabbitmq connection before connecting')
        }
        return this._consummerConnection
    }

    get channels() {
        if (!this._orderCreatedChannel) {
            throw new Error('Cannot access rabbit channel before connecting')
        }
        if (!this._orderUpdatedChannel) {
            throw new Error('Cannot access rabbit channel before connecting')
        }
        return {
            orderCreatedChannel: this._orderCreatedChannel,
            orderUpdateChannel: this._orderUpdatedChannel,
        }
    }

    async createConnection(url: string | Options.Connect, socketOptions?: any) {
        try {
            this._puhlishConnection = await amqplib.connect(url, socketOptions)
            this._consummerConnection = await amqplib.connect(url, socketOptions)

            this._orderCreatedChannel = await this._puhlishConnection.createChannel()
            this._orderUpdatedChannel = await this._puhlishConnection.createChannel()

            console.log('[AMQP] connected')
        } catch (error) {
            throw new Error('Can not establish connection to rabbitmq server')
        }
    }

    async cancelConnection() {
        this._consummerConnection?.close()
        this._puhlishConnection?.close()
    }
}

export const rabbitWrapper = new RabbitWrapper() // singleton class only return one instance
