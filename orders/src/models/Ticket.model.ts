import { model, Schema, Model, Document } from 'mongoose'
import { OrderStatus } from '@vuongtruong97nb/common'
import { Order } from './Order.model'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
    id: string
    title: string
    price: number
}

interface TicketModel extends Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
    findByIdAndPreVersion(args: {
        id: string
        version: number
    }): Promise<TicketDoc | null>
}

interface TicketDoc extends Document {
    id: string
    title: string
    price: number
    version: number
    isReserved(): Promise<boolean>
}

const ticketSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
})

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

// overwrite auto _id with id from ticket created event
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({ _id: attrs.id, price: attrs.price, title: attrs.title })
}

ticketSchema.statics.findByIdAndPreVersion = async (args: {
    id: string
    version: number
}) => {
    return await Ticket.findOne({ _id: args.id, version: args.version - 1 })
}

ticketSchema.methods.toJSON = function () {
    const ticket = this
    const newTicket = ticket.toObject()

    newTicket.id = newTicket._id

    delete newTicket._id

    return newTicket
}

ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaittingPayment,
                OrderStatus.Completed,
            ],
        },
    })
    return !!existingOrder
}

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket, TicketDoc }
