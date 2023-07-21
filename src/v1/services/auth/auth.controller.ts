import User, { patientProfile, practitionerProfile } from '../user/user.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import { asignNewToken } from '../../helpers/token'
import { validateAndFormat } from '../../utils'
import Logger from '../../libs/logger'
import Otp from '../otp/otp.model'
import walletModel from '../wallet/wallet.model'

import { v4 as uuidv4 } from 'uuid'
import { SendOTP } from '../../libs/temiiOTP'

const userService = new Services(User)
const otpService = new Services(Otp)
// const accountSid = process.env.ACCSID
// const authToken = process.env.AUTHTOKEN

const registerOne = async (req: any, res: any) => {
  try {
    // get user from request
    const { phone, password, role, firstName, lastName } = req.body

   if (!phone || !password) throw new Error('Phone and password are required')

   if (!firstName) throw new Error('firstName is required')
    // google sign In- temporary account untill phone is added
    // if (google) {
    //   if (!email || !phone) throw new Error('Email and phone is required for google auth')

    //   const newGoogleUser = await userService.create({ email, phone, role: role || 'patient' })

    //   return clientResponse(res, 201, newGoogleUser)
    // }

    const fmtPhone = validateAndFormat(phone)

    // formatPhone(phone)

    // // check if user already exists
    const isExisting = await userService.getOne({ phone: fmtPhone })

    if (isExisting) {
      // return error
      throw new Error('User already exists')
    }

// declare profile id
    let profile

    // create a profile
         if (role === 'patient') {
           const newProfile = await patientProfile.create({
             personalInfo: {
               firstName,
               lastName
             }
           })

         

           profile = newProfile

         } else if (role === 'doctor') {
           const newProfile = await practitionerProfile.create({
             personalInfo: {
               firstName,
               lastName
             }
           })

           // update user model to have profile id
           profile = newProfile
          
         }




    if (role === 'patient')
    {
      // // create new user
      const newUserData = {
        phone: fmtPhone,
        password,
        role: 'patient',
        profileId: profile?._id,
      }


    const newUser = await userService.create(newUserData)

      
      if (newUser)
      {
      
        // send otp
           const sendOtpResult = await SendOTP(fmtPhone)

           if (sendOtpResult.message === 'Insufficient balance') {
             return clientResponse(res, 201, {
               message: 'Something went wrong pls try again!'
             })
           }

           // if otp was sent successfully
           if (sendOtpResult.status === true) {
             // save otp to db and return otpId
             await otpService.create({
               phone: fmtPhone,
               otp: sendOtpResult.otpCode,
               otpId: sendOtpResult.otpId
             })
           }



      return clientResponse(res, 201, {
        message: 'Account created successfully. An OTP has been sent to your phone!',
        otpId: sendOtpResult.otpId,
        phone: fmtPhone
      })
    }

    } else if (role === 'doctor')
    {
      // // create new user
      const newUserData = {
        phone: fmtPhone,
        password,
        role: role || 'patient',
        profileId: profile?._id,
        verified: true
      }

    const newUser = await userService.create(newUserData)

    if (newUser) {
      const token = asignNewToken(phone)

      return clientResponse(res, 201, {
        message: 'Account created successfully.',
        token,
        newUser,
        profile
      })
    }
    }
    

      
    

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
    const user = await User.findOne({ phone: validateAndFormat(phone) });

    // const memberPassword = await User.findOne({ phone: validateAndFormat(phone) }).select({ password: 1, _id: 0 })

    // @ts-ignore
    const match = await user.comparePassword(password)

    if (!match) return clientResponse(res, 401, 'incorrect password')

    const token = asignNewToken(phone);
    let checkForWallet = await walletModel.findOne({ userId: user?._id});

    if (!checkForWallet) {
      const wallet = new walletModel({ userId: user?._id, balance: 0 });
      await wallet.save();
    }
    

    clientResponse(res, 201, { token: token, user: user})
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

    if (updatedPassword) {
      const token = asignNewToken(phone)

      return clientResponse(res, 201, { token: token, message: 'password has been updated successfully' })
    }
  } catch (error: any) {
    Logger.error('${error.message}')

    clientResponse(res, 400, { error: error.message, message: 'there was a problem signing you in' })
  }
}

export { registerOne, logIn, resetPassword }
