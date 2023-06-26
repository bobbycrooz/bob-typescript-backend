import { ErrorCode, ErrorException } from "../utils";
import  {Request, NextFunction, Response } from 'express'


function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    // authenticate
   
    next()
  } catch (error) {
    next(new ErrorException(ErrorCode.Unauthenticated))
  }
}
      
export default authenticate;