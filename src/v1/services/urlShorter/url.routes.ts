import { Router } from 'express'
import { redirectToLink, getLinkDetails, mapLink } from './url.controller'

const router = Router();

router.get('/:id', redirectToLink)
router.post('/create', mapLink)
router.post('/', getLinkDetails)


export default {
  baseUrl: '/url',
  router,
  auth: false
}