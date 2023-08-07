// @ts-nocheck
import { clientResponse } from '../helpers/response'
import Logger from '../libs/logger'
import { validateAndFormat } from '../utils'
import { Request, NextFunction, Response } from 'express'
import User from '../services/user/user.model'

async function authorize(req: Request, res: Response, next: NextFunction) {
  try {
    // authorize
    Logger.debug('Checkinig if user is authorized')

    const requestHeader = req.headers.authorization || req.headers.Authorization

    if (!requestHeader) clientResponse(res, 403, 'No token provided')

    const token = requestHeader?.split(' ')[1]

    const { err, phone } = await getUserFromToken(token)


    if (err) return clientResponse(res, 401, err)

    // fetch user
    const loggedInUserDetails = await User.findOne({ phone: validateAndFormat(phone) }).lean()

    req.user = loggedInUserDetails

    next()

  } catch (error)
  {
    
    // next(new ErrorException(ErrorCode.Unauthenticated))
    Logger.error(`${error.message} from authorize middleware`)

    clientResponse(res, 401, { error: error.message, message: 'User not authorized!' })
  }
}

export default authorize
