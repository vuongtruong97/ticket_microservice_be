import amqplib, { Connection, Options, Channel } from 'amqplib'

// singleton class
class RabbitWrapper {
    private _puhlishConnection?: Connection // underscore and question mark => this prop might be undefinded for some  periods of time
    private _consummerConnection?: Connection

    // channel
    private _expirationCompletedChannel?: Channel
    private _expirationCancelledChannel?: Channel

    //geter

    get consummerConnection() {
        if (!this._consummerConnection) {
            throw new Error('Cannot access rabbitmq connection before connecting')
        }
        return this._consummerConnection
    }

    get channels() {
        if (!this._expirationCompletedChannel) {
            throw new Error('Cannot access rabbit channel before connecting')
        }
        if (!this._expirationCancelledChannel) {
            throw new Error('Cannot access rabbit channel before connecting')
        }
        return {
            expirationCompletedChannel: this._expirationCompletedChannel,
            expirationCancelledChannel: this._expirationCancelledChannel,
        }
    }

    async createConnection(url: string | Options.Connect, socketOptions?: any) {
        this._puhlishConnection = await amqplib.connect(url, socketOptions)
        this._consummerConnection = await amqplib.connect(url, socketOptions)

        this._expirationCompletedChannel = await this._puhlishConnection.createChannel()
        this._expirationCancelledChannel = await this._puhlishConnection.createChannel()

        console.log('[AMQP] connected')
    }

    async cancelConnection() {
        this._consummerConnection?.close()
        this._puhlishConnection?.close()
    }
}

export const rabbitWrapper = new RabbitWrapper() // singleton class only return one instance
