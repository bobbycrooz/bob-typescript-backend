import { Router } from 'express'
import { availableDoctor, getUserByprofileId } from './doctor.controller'

const router = Router()

router.get('/available', availableDoctor)

// router.patch('/', updateProfile)

// router.patch('/status/:isAvailable', updateAvailability)

router.get('/:id', getUserByprofileId)

export default {
  baseUrl: '/doctor',
  router,
  auth: true
}

