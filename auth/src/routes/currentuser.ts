import { Router, Request, Response } from 'express'
import { currentUser, requireAuth } from '@vuongtruong97nb/common'
const router = Router()

router.get(
    '/api/users/currentuser',
    currentUser,
    // requireAuth,
    (req: Request, res: Response) => {
        res.send({ success: true, data: req.currentUser || null })
    }
)

export { router as currentUserRouter }
