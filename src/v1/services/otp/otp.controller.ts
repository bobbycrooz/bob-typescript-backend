import User from '../user/user.model'
import Otp from './otp.model'
import Services from '../../helpers/model.helper'
import {  clientResponse } from '../../helpers/response'
import { asignNewToken } from '../../helpers/token'

import { validateAndFormat } from '../../utils'
import Logger from '../../iibs/logger'
import client from 'twilio'
import otpG from 'otp-generator'
import { v4 as uuidv4 } from 'uuid'

const userService = new Services(User)
const otpService = new Services(Otp)

const accountSid = process.env.ACCSID
const authToken = process.env.AUTHTOKEN

const sendOtp = async (req: any, res: any) => {
  try {
    // get user from request
    const { phone } = req.query

    if (!phone) throw new Error('phone is required')

    // // check if user already exists
    const isExisting = await userService.getOne({ phone: validateAndFormat(phone) })

    if (!isExisting) {
      // return error
      throw new Error('you need to register this phone number first')
    }

    // const otp = Math.floor(1000 + Math.random() * 9000)
    var clientOtp = otpG.generate(6, { upperCaseAlphabets: false, specialChars: false })

    const otpId = uuidv4()

    // store otp code
    await otpService.create({
      phone: validateAndFormat(phone),
      otp: clientOtp,
      otpId
    })

    const twilioClient = client(accountSid, authToken)

    twilioClient.messages
      .create({
        body: `Your otp is ${clientOtp}`,
        from: '+14179322594',
        to: `${validateAndFormat(phone)}`
      })
      .then((message: { sid: any }) => {
        console.log(message.sid)
        Logger.info(message.sid)
        clientResponse(res, 201, {
          message: 'otp sent successfully',
          data: {
            otpId
          }
        })
      })
      .catch((error: any) => {
        Logger.error(error)
        clientResponse(res, 400, error.message)
      })

    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const verifyOtp = async (req: any, res: any) => {
  try
  {
    // get user from request
    const { otpCode, otpId, isReseting } = req.body
    

    if (!otpCode || !otpId) throw new Error('No otp  code provided')

    const savedOtp = await otpService.getOne({ otpId })

    if (!savedOtp) throw new Error('otp was not sent to this phone')

    // compare
    if (savedOtp.otp !== otpCode) return clientResponse(res, 403, 'invalid otp code')

    if (isReseting === true)
    {
      return clientResponse(res, 200, 'Phone number has been verified succesfully')
    }


    
    const verifyUser = await User.findOneAndUpdate(
      { phone: validateAndFormat(savedOtp.phone) },
      { verified: true },
      {
        new: true
      }
    ).lean()



    let token = asignNewToken(savedOtp.phone)

    if (verifyUser) {
      return clientResponse(res, 200, {
        message: 'Phone number has been verified succesfully',
        token
      })
    } else {
      clientResponse(res, 400, 'cant verify at this moment, try again later')
    }
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

export { sendOtp, verifyOtp }
