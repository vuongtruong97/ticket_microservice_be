import { Router, Request, Response } from 'express'
import {
    requireAuth,
    BadRequestError,
    DatabaseConnectionError,
} from '@vuongtruong97nb/common'
import { createTicketValidator } from '../validators/create-ticket-validator'
import { Ticket } from '../models/Ticket.model'

import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { rabbitWrapper } from '../rabbitmq-wrapper'

const router = Router()

router.post(
    '/api/tickets',
    requireAuth,
    createTicketValidator,
    async (req: Request, res: Response) => {
        const { price, title } = req.body

        const ticket = Ticket.build({ price, title, userId: req.currentUser!.id })

        const result = await ticket.save()

        if (!result) {
            console.log('Create user failed')
            throw new DatabaseConnectionError()
        }

        await new TicketCreatedPublisher(
            rabbitWrapper.channels.ticketCreatedChannel
        ).publish({
            id: result.id,
            title: result.title,
            price: result.price,
            userId: result.userId,
            version: result.version,
        })

        res.status(201).send({ success: true, data: result })
    }
)

export { router as createTicketRouter }
