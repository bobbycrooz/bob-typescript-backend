import { Router } from 'express'
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  selectPrescriptionForReview,
  prescriptionHistory,
  cancleSelectedPriscription,
  rejectPrescription,
  approvePrescription
} from './prescription.controller'

const router = Router()

router.post('/', createPrescription) //tested

router.get('/', getPrescriptions)  //tested

router.get('/history', prescriptionHistory) //doctor  tested

router.get('/:id', getPrescriptionById)  //tested

router.patch('/approve', approvePrescription)   //tested

router.patch('/reject', rejectPrescription)  //tested

router.patch('/:id/select', selectPrescriptionForReview)  //tested

router.patch('/:id/cancel', cancleSelectedPriscription)     //tested

export default {
  baseUrl: '/prescription',
  router,
  auth: true
}
