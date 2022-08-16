import { model, Model, Document, Schema } from 'mongoose'
import { OrderStatus } from '@vuongtruong97nb/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
    id: string
    version: number
    userId: string
    price: number
    status: OrderStatus
}

interface OrderModel extends Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc
}

interface OrderDoc extends Document {
    id: string
    version: number
    userId: string
    price: number
    status: OrderStatus
}

const orderSchema = new Schema({
    status: { type: String, required: true, enum: Object.values(OrderStatus) },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
})

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        userId: attrs.userId,
        price: attrs.price,
        version: attrs.version,
        status: attrs.status,
    })
}

orderSchema.methods.toJSON = function () {
    const order = this
    const newOrder = order.toObject()

    newOrder.id = newOrder._id

    delete newOrder._id

    return newOrder
}

const Order = model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
