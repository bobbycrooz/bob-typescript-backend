import { Router } from 'express'
import {

} from './appointment.controller';



import express, { NextFunction, Request, Response } from 'express'
import { ErrorCode, ErrorException } from '../../utils/'
import { getAllGeneralPractitioners, getSpecialists, getDoctorProfile,createAppointment, getAllUserAppointments, respondToAppointment } from './appointment.controller'

const router = Router();


router.get('/generalDoctors', getAllGeneralPractitioners)
router.post('/specialists', getSpecialists);
router.get('/doctor/:id', getDoctorProfile);
router.post('/', createAppointment);
router.get('/', getAllUserAppointments);
router.patch('/:id', respondToAppointment);
// router.get('/', getPrescriptions)
// router.get('/:id', getPrescriptionById)

export default {
  baseUrl: '/appointment',
  router,
  auth: true
}