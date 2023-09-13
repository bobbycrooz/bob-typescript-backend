import { Router } from 'express'
import { redirectToLink, getLinkDetails, mapLink, getUrls } from './url.controller'

const router = Router();

router.get('/:id', redirectToLink)
router.post('/create', mapLink)
router.post('/', getLinkDetails)
router.post('/bee', getUrls)


export default {
  baseUrl: '/url',
  router,
  auth: false
}