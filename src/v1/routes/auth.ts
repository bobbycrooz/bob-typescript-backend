import { Router } from 'express'
import express, { NextFunction, Request, Response } from 'express'
import { ErrorCode, ErrorException } from '../utils'
import User from '../models/user'
import { registerOne, logIn } from '../controllers/auth.controller'
import { sendOtp, verifyOtp } from '../controllers/otp.controller'

console.log(User, 'from auth route')

const router = Router()

router.post('/register', registerOne)

router.post('/login', logIn)

router.get('/send-otp', sendOtp)

router.post('/verify-otp', verifyOtp)

export default {
  baseUrl: '/auth',
  router
  // auth: true
}
