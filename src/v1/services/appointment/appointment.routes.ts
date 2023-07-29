import { Router } from 'express'
import { getDoctorTotalAppointments, getUserTotalAppointments } from './appointment.controller';



import express, { NextFunction, Request, Response } from 'express'
import { ErrorCode, ErrorException } from '../../utils/'
import { getAllGeneralPractitioners, getSpecialists, getDoctorProfile, createAppointment, rateAppointment, getAllUserAppointments, respondToAppointment,rescheduleAppointment, getUserUpcomingAppointments } from './appointment.controller'

const router = Router();


router.get('/generalDoctors', getAllGeneralPractitioners)
router.post('/specialists', getSpecialists);
router.get('/doctor/:id', getDoctorProfile);
router.post('/', createAppointment);
router.get('/', getAllUserAppointments);
router.patch('/:id', respondToAppointment);
router.patch('/rate/:id', rateAppointment);
router.patch('/reschedule/:id', rescheduleAppointment);
router.get('/userTotalAppointments', getUserTotalAppointments);
router.get('/doctorTotalAppointments', getDoctorTotalAppointments);
router.get('/userUpcoming',getUserUpcomingAppointments)

export default {
  baseUrl: '/appointment',
  router,
  auth: true
}
