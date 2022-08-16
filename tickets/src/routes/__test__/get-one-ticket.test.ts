import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

jest.mock('../../rabbitmq-wrapper.ts')

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    const res = await request(app).get(`/api/tickets/${id}`).send().expect(404)
})

it('returns the ticket if the ticket is found', async () => {
    const title = 'concert'
    const price = 20

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', signin())
        .send({
            title,
            price,
        })
        .expect(201)

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.data.id}`)
        .send()
        .expect(200)

    expect(ticketResponse.body.data.title).toEqual(title)
    expect(ticketResponse.body.data.price).toEqual(price)
})
