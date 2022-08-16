import { model, Schema, Model, Document } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
    title: string
    price: number
    userId: string
}

interface TicketModel extends Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

interface TicketDoc extends Document {
    title: string
    price: number
    userId: string
    version: number
    orderId?: string
}

const ticketSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
    orderId: { type: String },
})

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
}

ticketSchema.methods.toJSON = function () {
    const ticket = this
    const newTicket = ticket.toObject()

    newTicket.id = newTicket._id

    delete newTicket._id

    return newTicket
}

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
