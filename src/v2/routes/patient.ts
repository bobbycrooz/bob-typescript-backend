import { Router } from 'express'
import express, { NextFunction, Request, Response } from 'express'
import { ErrorCode, ErrorException } from '../utils'
import User from '../models/user'
import { getProfile } from '../controllers/patient.controller'
import { sendOtp, verifyOtp } from '../controllers/otp.controller'

console.log( 'from patient route')

const router = Router()

router.get('/profile', getProfile)



export default {
  baseUrl: '/patient',
  router,
  auth: true
}
