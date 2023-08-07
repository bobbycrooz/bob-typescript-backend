import { Router } from 'express'
import { getWallets, getWalletById } from './wallet.controller'

const router = Router();

router.get('/', getWallets)
router.get('/:id', getWalletById)


export default {
  baseUrl: '/wallets',
  router,
  auth: false
}