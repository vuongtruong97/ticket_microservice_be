import express, { Request, Response } from 'express'
import { NotFoundError } from '@vuongtruong97nb/common'
import { Ticket } from '../models/Ticket.model'

const router = express.Router()

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find()

    res.status(200).send({ success: true, data: tickets })
})

export { router as listTicketRouter }
