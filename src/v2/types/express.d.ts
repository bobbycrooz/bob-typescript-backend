// import { User } from '../path-to-your-user-type'
import { Request } from 'express'

declare global {
  namespace Express {
    interface Request {
      user: string
    }
  }
}
