import { Router } from 'express'
import { profile, updateProfile, getProfileById } from './user.controller'

const router = Router()

router.get('/', profile)

router.patch('/', updateProfile)

router.get('/:id', getProfileById)

export default {
  baseUrl: '/profile',
  router,
  auth: true
}
