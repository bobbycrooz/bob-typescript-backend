import { Router } from 'express'
import { createUser, getUsers, logIn, connetToUser, editProfile } from './user.controller'

const router = Router()

router.post('/login', logIn)

router.post('/connect', connetToUser)

router.post('/', createUser)

router.patch('/', editProfile)

router.get('/', getUsers)



export default {
  baseUrl: '/user',
  router,
  auth: false
}
