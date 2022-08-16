import request from 'supertest'
import { app } from '../../app'

test('returns a 400 on not exist email signin', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(400)
})

test('returns a 400 on incorrect password signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201)

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'incorrectpass',
        })
        .expect(400)
})

test('returns a 200 on successful signin with cookie', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'Password!',
        })
        .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'Password!',
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined()
})
