import express, { Request, Response } from 'express'
import {
    BadRequestError,
    NotAuthError,
    NotFoundError,
    requireAuth,
    validateRequest,
} from '@vuongtruong97nb/common'
import { Ticket } from '../models/Ticket.model'
import { createTicketValidator } from '../validators/create-ticket-validator'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { rabbitWrapper } from '../rabbitmq-wrapper'

const router = express.Router()

router.put(
    '/api/tickets/:id',
    requireAuth,
    createTicketValidator,
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id)

        if (!ticket) {
            throw new NotFoundError()
        }

        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthError()
        }

        if (!!ticket.orderId) {
            throw new BadRequestError('Cannot edit a reserved ticket')
        }

        ticket.set({
            title: req.body.title,
            price: req.body.price,
        })

        await ticket.save()

        console.log(ticket)
        await new TicketUpdatedPublisher(
            rabbitWrapper.channels.ticketUpdateChannel
        ).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
        })

        res.status(200).send({ success: true, data: ticket })
    }
)

export { router as updateTicketById }
