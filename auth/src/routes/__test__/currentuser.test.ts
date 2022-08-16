import request from 'supertest'
import { app } from '../../app'

test('Response with details about current user', async () => {
    const cookie = await signin()
    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(response.body.data !== null)
})

test('Response 401 not authenticated', async () => {
    const response = await request(app).get('/api/users/currentuser').send()
    expect(response.body.data).toEqual(null)
})
