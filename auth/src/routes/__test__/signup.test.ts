import request from 'supertest'
import { app } from '../../app'

test('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'Password!',
        })
        .expect(201)
})

test('returns a 400 on invalid email signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'password',
        })

        .expect(400)
})

test('returns a 400 on invalid password signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'a',
        })
        .expect(400)
})

test('returns a 400 on empty password and email signup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
        })
        .expect(400)

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'password',
        })
        .expect(400)
})

test('Disallow duplicated emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201)

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(400)
})

test('Sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password',
        })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
})
