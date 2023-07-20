import { Router } from 'express'
import { profile, updateProfile, getProfileById, updateAvailability } from './user.controller'

const router = Router()

router.get('/', profile)

router.patch('/', updateProfile)


router.patch('/status/:isAvailable', updateAvailability)

router.get('/:id', getProfileById)



export default {
  baseUrl: '/profile',
  router,
  auth: true
}
