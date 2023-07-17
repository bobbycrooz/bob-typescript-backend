import fetch from 'node-fetch'
import otpG from 'otp-generator'
import { v4 as uuidv4 } from 'uuid'
import request from 'request'
import { generateRandomCode } from '../utils'

export async function SendOTP(phone: number)
{
  

  const genOtpCode = generateRandomCode(6)

  const OtpData = {
    to: phone,
    from: 'selfTut',
    sms: `Hi your DokRx OTP code is ${genOtpCode}`,
    type: 'plain',
    channel: 'generic',
    api_key: 'TLGebSSg5RAdNwm2IYUEgMPgDitGB33e5pzWxfkheToP8wnVZ0IzwYCpod8UEk'
  }

  const url = 'https://api.ng.termii.com/api/sms/send'

  const options = {
    method: 'post',

    headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(OtpData)
  }

  // @ts-ignore
  const response = await fetch(url, options)

  const data = await response.json()

  console.log(data)
  if (data.code === "ok")
  {
    return {
      status: true,
      otpId: data.message_id,
      otpCode: genOtpCode,
      message: data.message
    }
  }

  return {
    status: false,
    message: data.message
  }
}
