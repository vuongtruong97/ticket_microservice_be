import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/Ticket.model'
import { rabbitWrapper } from '../../rabbitmq-wrapper'

jest.mock('../../rabbitmq-wrapper.ts')

test('has a route handler listening to  /api/tickets', async () => {
    const response = await request(app).post('/api/tickets').send({})
    expect(response.status).not.toEqual(404)
})
test('expect 401 : can only accessed if user is signedin', async () => {
    const response = await request(app).post('/api/tickets').send({})
    expect(response.status).toEqual(401)
})

test('return a status code other than 401 if user is signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({})

    expect(response.status).not.toEqual(401)
})
test('return an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title: '',
            price: 1000,
        })
        .expect(400)
})

test('create a ticket with valid inputs', async () => {
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    const title = 'asldkfj'

    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title,
            price: 20,
        })
        .expect(201)

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].price).toEqual(20)
    expect(tickets[0].title).toEqual(title)
})

test('publish an event', async () => {
    const title = 'title'
    await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title,
            price: 20,
        })
        .expect(201)

    expect(rabbitWrapper.connection.createChannel).toHaveBeenCalled()
})
