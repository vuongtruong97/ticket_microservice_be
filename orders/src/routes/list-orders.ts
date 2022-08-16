import { Router, Request, Response } from 'express'
import { Order } from '../models/Order.model'
import { NotFoundError } from '@vuongtruong97nb/common'

const router = Router()

router.get('/api/orders', async (req: Request, res: Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id,
    }).populate('ticket')

    if (!orders) {
        throw new NotFoundError()
    }
    res.send({ success: true, data: orders })
})

export { router as listOrderRouter }
