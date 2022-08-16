import request from 'supertest'
import { app } from '../../app'

const createTicket = () => {
    return request(app).post('/api/tickets').set('Cookie', signin()).send({
        title: 'asldkf',
        price: 20,
    })
}

test('can fetch a list of tickets', async () => {
    await createTicket()
    await createTicket()
    await createTicket()

    const response = await request(app).get('/api/tickets').send().expect(200)

    expect(response.body.data.length).toEqual(3)
})