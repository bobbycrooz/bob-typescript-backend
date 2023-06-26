import { Request, Response } from 'express'
import config from '../config'
import jwt from 'jsonwebtoken'




// response helper
export const clientResponse = (res: any, status: number, message: string | object) =>
{
 
  
   function isSuccess(code: string) {
     if (code.startsWith('2')) {
       return true
     } else {
       return false
     }
   }
  

  return res
    .status(status)
    .send(
      typeof message === 'string'
        ? { success: isSuccess(String(status)), message: message }
        : { success: isSuccess(String(status)), ...message }
    )
    .end()
}

// assign token helper
export const asignNewToken = (data: string | object) => {
  return jwt.sign(data, config.SECRET || '', typeof data === 'object' ? { expiresIn: '1h' } : {} )
}
