import { Router } from 'express'
import express, { NextFunction, Request, Response } from 'express'
import { ErrorCode, ErrorException } from '../../utils'
import User from '../user/user.model'
import { registerOne, logIn, resetPassword, deleteAccount } from './auth.controller'
import { sendOtp, verifyOtp } from '../otp/otp.controller'

console.log(User, 'from auth route')

const router = Router()

router.post('/register', registerOne)

router.post('/login', logIn)

router.get('/send-otp', sendOtp)

router.post('/verify-otp', verifyOtp)

router.post('/reset', resetPassword)

router.delete('/delete', deleteAccount)

export default {
  baseUrl: '/auth',
  router,
  auth: false
}
