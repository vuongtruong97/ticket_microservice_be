import { Router, Request, Response } from 'express'
import { createPaymentValidator } from '../validators/create-payment-validator'
import { Order } from '../models/Order.model'
import { Payment } from '../models/Payment.model'
import {
    BadRequestError,
    NotAuthError,
    OrderStatus,
    NotFoundError,
} from '@vuongtruong97nb/common'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { rabbitWrapper } from '../rabbitmq-wrapper'

const router = Router()

router.post(
    '/api/payments',
    createPaymentValidator,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body

        const order = await Order.findById(orderId)

        if (!order) {
            throw new NotFoundError()
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthError()
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an cancelled order')
        }

        const payment = Payment.build({
            orderId,
            stripeId: Math.floor(Math.random() * 10000).toString(), // test payment
        })

        await payment.save()

        await new PaymentCreatedPublisher(
            rabbitWrapper.channels.paymentCreatedChannel
        ).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId,
        })

        res.send({ success: true, message: 'Create payment successfully' })
    }
)

export { router as createPaymentRouter }
