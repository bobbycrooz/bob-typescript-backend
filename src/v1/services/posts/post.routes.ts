import { Router } from 'express'
import { getPosts, createPost } from './post.controller'

const router = Router();

router.get('/', getPosts)
router.post('/', createPost)


export default {
  baseUrl: '/post',
  router,
  auth: false
}