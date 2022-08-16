import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'
import request from 'supertest'
import jwt from 'jsonwebtoken'

declare global {
    var signin: () => string[]
}

let mongo: any
beforeAll(async () => {
    process.env.JWT_KEY = 'super-secret-test-string'
    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()
    await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections() // get all exist collections
    // loop overall colls and delete all document
    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    // if (mongo) {
    // }
    await mongo.stop()
    await mongoose.connection.close()
})

global.signin = () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    // create payload
    const payload = {
        email: 'test@test.com',
        id,
    }
    // create jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!)
    // build session object {jwt: MY_JWT}
    const session = { jwt: token }
    // turn that session into JSON
    const sessionJSON = JSON.stringify(session)

    //take json and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64')

    // return a string thats the cookie with the encoded data
    return [`session=${base64}`]
}
