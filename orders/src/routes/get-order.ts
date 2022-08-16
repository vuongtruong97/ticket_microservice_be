import { BadRequestError, NotFoundError, NotAuthError } from '@vuongtruong97nb/common'
import { Router, Request, Response } from 'express'
import { Order } from '../models/Order.model'

const router = Router()

router.get('/api/orders/:orderId', async (req: Request, res: Response) => {
    const order = await Order.findById({
        _id: req.params.orderId,
    }).populate('ticket')

    if (!order) {
        throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthError()
    }
    res.send({ success: true, data: order })
})

export { router as getOrderRouter }
