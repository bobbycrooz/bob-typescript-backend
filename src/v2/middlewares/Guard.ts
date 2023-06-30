// @ts-nocheck
import { clientResponse } from "../helpers/response";
import { getUserFromToken } from "../helpers/token";
import Logger from "../iibs/logger";
import { ErrorCode, ErrorException } from "../utils";
import  {Request, NextFunction, Response } from 'express'


async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // authorize

    Logger.debug('the protect middle ware got called')
    
       const requestHeader = req.headers.authorization || req.headers.Authorization

       if (!requestHeader) clientResponse(res, 403, 'No token provided')

       const token = requestHeader?.split(' ')[1]

       const { err, user } = await getUserFromToken(token)

       Logger.info('authorization middleware is working')

       if (err) return clientResponse(res, 401, err)

       req.user = { phone: user }
   
    next()
  } catch (error) {
    next(new ErrorException(ErrorCode.Unauthenticated))
  }
}
      
export default authenticate;