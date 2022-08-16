import { Router, Request, Response } from 'express'
import { createOrderValidator } from '../validators/create-order-validator'
import { Ticket } from '../models/Ticket.model'
import { Order } from '../models/Order.model'
import { NotFoundError, BadRequestError, OrderStatus } from '@vuongtruong97nb/common'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { rabbitWrapper } from '../rabbitmq-wrapper'

const router = Router()
const EXPIRATION_ORDER_SECONDS = 60 * 0.5

router.post('/api/orders', createOrderValidator, async (req: Request, res: Response) => {
    // find the ticket the user is  trying to order in the database
    const { ticketId } = req.body

    const ticket = await Ticket.findById(ticketId)

    if (!ticket) {
        throw new NotFoundError()
    }
    // make sure the ticket is not  already reserved
    const isReversed = await ticket.isReserved()
    if (isReversed) {
        throw new BadRequestError('Vé này đã có người đặt mua')
    }

    // calculate an expirations date for this order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_ORDER_SECONDS)

    // build the order and save it to the database

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket._id,
    })

    await order.save()

    await new OrderCreatedPublisher(rabbitWrapper.channels.orderCreatedChannel).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: { id: ticket.id, price: ticket.price },
        version: order.version,
    })

    // publish an events the order was created
    res.status(201).send({ success: true, data: order })
})

export { router as createOrderRouter }
