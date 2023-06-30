import { Router } from 'express'
import express, { NextFunction, Request, Response } from 'express'
import { ErrorCode, ErrorException } from '../../utils/'
import { createPrescription, getPrescriptions, getPrescriptionById } from './prescription.controller'




const router = Router()

router.post('/', createPrescription)
router.get('/', getPrescriptions)
router.get('/:id', getPrescriptionById)

export default {
  baseUrl: '/prescription',
  router,
  auth: true
}
