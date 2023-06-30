import { Request, Response } from 'express'
import config from '../config'
import jwt from 'jsonwebtoken'
// import { token } from 'morgan'

// assign token helper
export const asignNewToken = (data: string | object) => {
  return jwt.sign(data, config.SECRET || '', typeof data === 'object' ? { expiresIn: '1h' } : {})
}

// get user from token
export const getUserFromToken = async (token: string) =>
{
      console.log('jwt is runing');
      
  return jwt.verify(token, config.SECRET as string, (err, decode) => {
    if (err)
      return {
        err: err.message,
        phone: null
      }

    return {
      err: null,
      phone: decode
    }
  })
}
