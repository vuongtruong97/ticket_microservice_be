import { sign, verify } from 'jsonwebtoken'

export class Jsonwebtoken {
    static sign(payload: string | Buffer | object) {
        return sign(payload, process.env.JWT_KEY!)
    }

    static verifyPayload(token: string) {
        return verify(token, process.env.JWT_KEY!)
    }
}
