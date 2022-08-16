import { Router, Request, Response } from 'express'
import { OrderStatus, NotFoundError, NotAuthError } from '@vuongtruong97nb/common'
import { Order } from '../models/Order.model'
import { OrderCanceledPublisher } from '../events/publishers/order-cancelled-publisher'
import { rabbitWrapper } from '../rabbitmq-wrapper'
const router = Router()

router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) {
        throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    await new OrderCanceledPublisher(rabbitWrapper.channels.orderUpdateChannel).publish({
        id: order.id,
        ticket: { id: order.ticket.id },
        version: order.version,
    })

    res.status(202).send({ success: true, data: order })
})

export { router as deleteOrderRouter }
