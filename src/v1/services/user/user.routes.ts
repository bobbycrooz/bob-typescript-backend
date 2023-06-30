import { Router } from 'express'




const router = Router()

router.get('/profile', (req, res, next) =>
{
      console.log('good job');
      
})

export default {
  baseUrl: '/patient',
  router,
  auth: true
}
