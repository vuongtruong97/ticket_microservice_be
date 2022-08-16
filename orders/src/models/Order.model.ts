import { model, Schema, Model, Document } from 'mongoose'
import { TicketDoc } from './Ticket.model'
import { OrderStatus } from '@vuongtruong97nb/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: Schema.Types.ObjectId
}

interface OrderDoc extends Document {
    userId: string
    status: OrderStatus
    expiresAt: Date
    ticket: TicketDoc
    version: number
}

interface OrderModel extends Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new Schema({
    userId: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created,
    },
    expiresAt: { type: Date },
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket' },
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
}

orderSchema.methods.toJSON = function () {
    const Order = this
    const newOrder = Order.toObject()

    newOrder.id = newOrder._id
    delete newOrder._id

    return newOrder
}

const Order = model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
