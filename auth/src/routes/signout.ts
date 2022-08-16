import { Router, Request, Response } from 'express'

const router = Router()

router.get('/api/users/signout', (req: Request, res: Response) => {
    req.session = null
    res.send({ success: true })
})

export { router as signoutRouter }
