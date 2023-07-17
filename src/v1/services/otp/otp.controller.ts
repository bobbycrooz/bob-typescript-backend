import User from '../user/user.model'
import Otp from './otp.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import { asignNewToken } from '../../helpers/token'
import { generateRandomCode, validateAndFormat } from '../../utils'
import Logger from '../../libs/logger'
import client from 'twilio'

// @ts-ignore
import Jusibe from 'jusibe'
import { SendOTP } from "../../libs/temiiOTP"
const userService = new Services(User)

const otpService = new Services(Otp)

const accountSid = process.env.ACCSID

const authToken = process.env.AUTHTOKEN

const jusibe = new Jusibe('fccad1ae6c9759953f4ad908f78bb6de', '9595e6a47f50086758ce43ac997342be')

const sendOtp = async (req: any, res: any) => {
  try {
    // get user from request
    const { phone } = req.query

    if (!phone) throw new Error('phone is required')

    // // check if user already exists
    const isExisting = await userService.getOne({ phone: validateAndFormat(phone) })

    if (!isExisting) {
      // return error
      throw new Error('You need to register this phone number first')
    }


    const sendOtpResult = await SendOTP(validateAndFormat(phone))

    if (sendOtpResult.status === false)
    { 
      return clientResponse(res, 408, {
        message: `we couldn't send otp to this number at this time due to ${sendOtpResult.message}`
      })
     }

    if (sendOtpResult.message === 'Insufficient balance') {
      return clientResponse(res, 201, {
        message: 'Account created but there was a problem verifying your number',
      
      })
    }

    if (sendOtpResult.status === true)
    {
      const otpData = {
        phone: validateAndFormat(phone),
        otpId: sendOtpResult.otpId,
        otp: sendOtpResult.otpCode
      }
  
      const saveOtp = await otpService.create(otpData)
  
      if (!saveOtp) {
        return clientResponse(res, 400, {
          message: 'could not save otp to database'
        })  
      }
    }


      return clientResponse(res, 201, {
        message: 'An OTP has been sent to your number.',
        otpId: sendOtpResult.otpId,
      })

    // if (['Insufficient balance'].includes())
    //   clientResponse(res, 400, {
    //     message: 'something went wron',
    //     data: sendOtpResult
    //   })

    // return response
  } catch (error: typeof Error | any) {
    Logger.error(`${error.message}`)

    // return error
    clientResponse(res, 400, error.message)
  }
}

const verifyOtp = async (req: any, res: any) => {
  try {
    // get user from request
    const { otpCode, otpId, isReseting } = req.body

    if (!otpCode || !otpId) throw new Error('No otp  code provided')

    const savedOtp = await otpService.getOne({ otpId })

    if (!savedOtp) throw new Error('otp was not sent to this phone')

    // compare
    if (savedOtp.otp !== otpCode) return clientResponse(res, 403, 'invalid otp code')

    if (isReseting === true) {
      return clientResponse(res, 200, 'Phone number has been verified succesfully')
    }

    const verifyUser = await User.findOneAndUpdate(
      { phone: savedOtp.phone },
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
