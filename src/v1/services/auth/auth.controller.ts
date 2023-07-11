import User from '../user/user.model'
import Services from '../../helpers/model.helper'
import {  clientResponse } from '../../helpers/response'
import { asignNewToken } from '../../helpers/token'
import { validateAndFormat } from '../../utils'
import Logger from '../../iibs/logger'
import Otp from '../otp/otp.model'

import client from 'twilio'
import otpG from 'otp-generator'
import { v4 as uuidv4 } from 'uuid'

const userService = new Services(User)
const otpService = new Services(Otp)
const accountSid = process.env.ACCSID
const authToken = process.env.AUTHTOKEN


const registerOne = async (req: any, res: any) => {
  try {
    // get user from request
    const { phone, password, role, google, email, username } = req.body

    if (!google) {
      if (!phone || !password) throw new Error('Phone and password are required')

      if (!username) throw new Error('username is required')
    }

    // google sign In- temporary account untill phone is added
    if (google) {
      if (!email || !phone) throw new Error('Email and phone is required for google auth')

      const newGoogleUser = await userService.create({ email, phone, role: role || 'patient' })

      return clientResponse(res, 201, newGoogleUser)
    }

    const fmtPhone = validateAndFormat(phone)

    // formatPhone(phone)

    // // check if user already exists
    const isExisting = await userService.getOne({ phone })

    if (isExisting) {
      // return error
      throw new Error('user already exists')
    }

    // // create new user
    const newUserData = {
      phone: fmtPhone,
      password,
      role: role || 'patient'
    }

    await userService.create(newUserData)

    // send otp to user

    // const otp = Math.floor(1000 + Math.random() * 9000)
    var clientOtp = otpG.generate(6, { upperCaseAlphabets: false, specialChars: false })

    const otpId = uuidv4()

    // store otp code
    await otpService.create({
      phone: phone,
      otp: clientOtp,
      otpId
    })

    const twilioClient = client(accountSid, authToken)

    twilioClient.messages
      .create({
        body: `Your otp is ${clientOtp}`,
        from: '+14179322594',
        to: fmtPhone as string
      })
      .then((message: { sid: any }) => {
        console.log(message.sid)
        Logger.info(message.sid)
        clientResponse(res, 201, {
          message: 'Account created successfully, An otp has been sent to your phone number',
          data: {
            otpId
          }
        })
      })
      .catch((error: any) => {
        Logger.error(error)
        clientResponse(res, 400, error.message)
      })

    // clientResponse(res, 201, {
    //   message: 'An otp has been sent to your phone number'
    // })

    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}


// login 
const logIn = async (req: any, res: any) => {
  const { phone, password } = req.body

  try {
    if (!phone || !password) throw new Error('phone and password are required')
    // @ts-ignore
    const isExisting = await User.checkExistingUser(validateAndFormat(phone))

    if (!isExisting) return clientResponse(res, 401, 'you need to register first you dont exist')

    // const user = await userService.getOne({ phone })
    const user = await User.findOne({ phone: validateAndFormat(phone) })

    // const memberPassword = await User.findOne({ phone: validateAndFormat(phone) }).select({ password: 1, _id: 0 })

    // @ts-ignore
    const match = await user.comparePassword(password) 

    if (!match) return clientResponse(res, 401, 'incorrect password')

    const token = asignNewToken(phone)

    clientResponse(res, 201, { token: token, member: user })
  } catch (error: any) {
    Logger.error('${error.message}')

    clientResponse(res, 400, { error: error.message, message: 'there was a problem signing you in' })
  }
}


// reset password 
const resetPassword = async (req: any, res: any) => {
  const { phone, newPassword } = req.body

  try {
    if (!phone || !newPassword) throw new Error('new password is required')
    // @ts-ignore
    const isExisting = await User.checkExistingUser(validateAndFormat(phone))

    if (!isExisting) return clientResponse(res, 401, 'you need to register first you dont exist')

    // const user = await userService.getOne({ phone })
    const updatedPassword = await User.findOneAndUpdate(
      { phone: validateAndFormat(phone) },
      { password: newPassword }
    ).lean()

    if (updatedPassword)
    {
      const token = asignNewToken(phone)

      
      return clientResponse(res, 201, { token: token, message: "password has been updated successfully" })
      
    }



  } catch (error: any) {
    Logger.error('${error.message}')

    clientResponse(res, 400, { error: error.message, message: 'there was a problem signing you in' })
  }
}



export { registerOne, logIn, resetPassword }
