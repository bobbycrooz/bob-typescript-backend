import { Router } from 'express'
import { createUser, getUsers, fundWallet, sendMoney } from './user.controller'

const router = Router()

router.post('/', createUser)

router.get('/', getUsers)

router.patch('/fund', fundWallet)

router.post('/send', sendMoney)

export default {
  baseUrl: '/user',
  router,
  auth: false
}
