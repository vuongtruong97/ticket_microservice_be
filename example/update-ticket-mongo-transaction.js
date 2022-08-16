const express = require('express')
const db = require('mongoose')

// IMPORT MIDDLWARES
const importCommon = require('@erwanriou/ticket-shop-common')
const isLogged = importCommon('middlewares', 'isLogged')

// IMPORT MODEL
const Ticket = require('../../models/Ticket')

// IMPORT EVENTS
const { NatsWrapper } = require('../../services/eventbus')
const { TicketCreatedPub } = require('../../events/publishers/ticketCreatedPub')
const { TicketUpdatedPub } = require('../../events/publishers/ticketUpdatedPub')

//ERRORS VALIDATION
const validator = require('express-validator')
const validateRequest = importCommon('middlewares', 'validateRequest')
const { NotFoundError, NotAuthorizedError, DatabaseConnectionError } = importCommon(
    'factory',
    'errors'
)

// DECLARE ROUTER
const router = express.Router()

// @route  POST api/tickets
// @desc   Create a ticket
// @access Private
router.post(
    '/',
    isLogged,
    [
        validator.body('title').not().isEmpty().withMessage('Title is required'),
        validator
            .body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (req, res) => {
        const { title, price } = req.body

        // CREATE TICKET
        const ticketFields = { userId: req.user.id, title, price }

        // HANDLE MONGODB TRANSACTIONS
        const SESSION = await db.startSession()
        // TRANSACTION
        try {
            await SESSION.startTransaction()
            const ticket = await new Ticket(ticketFields).save()
            await new TicketCreatedPub(NatsWrapper.client()).publish({
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userId,
            })
            await SESSION.commitTransaction()
            res.status(201).send(ticket)
        } catch (err) {
            // CATCH ANY ERROR DUE TO TRANSACTION
            await SESSION.abortTransaction()
            throw new DatabaseConnectionError()
        } finally {
            // FINALIZE SESSION
            SESSION.endSession()
        }
    }
)
