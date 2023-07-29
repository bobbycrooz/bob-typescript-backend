import { Router } from 'express'



import express, { NextFunction, Request, Response } from 'express'
import { ErrorCode, ErrorException } from '../../utils/'

const router = Router();


// router.get('/generalDoctors', getAllGeneralPractitioners)


export default {
  baseUrl: '/subscription',
  router,
  auth: true
}