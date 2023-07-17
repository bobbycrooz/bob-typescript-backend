import User from '../services/user/user.model'
import Services from '../helpers/model.helper'
import {  clientResponse } from '../helpers/response'
// import { asignNewToken } from '../helpers/token'
import { validateAndFormat } from '../utils'
import Logger from '../libs/logger'

const userService = new Services(User)

const getProfile = async (req: any, res: any) => {
  try {
    // get user from request

    const user = req.user

    const userData = await userService.getOne({ phone: validateAndFormat(user.phone) })



    if (userData) return  clientResponse(res, 200, userData)

    clientResponse(res, 400, 'something went wrong getting user details')

    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}


export { getProfile }
