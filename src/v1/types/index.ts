import { Request } from 'express'

type customReq = Request & { user: string }

export { customReq }
