import express, { Request, Response } from 'express'
import { NotFoundError } from '@vuongtruong97nb/common'
import { Ticket } from '../models/Ticket.model'

const router = express.Router()

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        throw new NotFoundError()
    }

    res.status(200).send({ success: true, data: ticket })
})

export { router as getTicketById }
