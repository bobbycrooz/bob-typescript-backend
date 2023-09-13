import User from '../user/user.model'
import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import { validateAndFormat } from '../../utils'
import Logger from '../../libs/logger'
import postModel from './post.model'

const walletService = new Services(postModel)

// login
const getPosts = async (req: any, res: any) => {
  try {
    const { id } = req.query

    let filterBy = {}

    if (id) {
      filterBy = {
        uuid: id
      }
    }

    const posts = await postModel.find(filterBy).populate({
      path: 'uuid',
      select: 'username email'
    }).lean()

    console.log(posts)

    if (posts) {
      return clientResponse(res, 200, posts)
    }

    clientResponse(res, 404, 'No post found ')
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving wallets' })
  }
}

const createPost = async (req: any, res: any) => {
  const { id, title, body } = req.body

  try {
    if (!id) {
      throw new Error('User id is required!')
    }

    if (title && body) {
      // create new post
      const newPost = await postModel.create({
        title,
        body,
        uuid: id
      })

      if (newPost) return clientResponse(res, 201, 'Published!')
    } else {
      return clientResponse(res, 403, 'All fields are required! ')
    }
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'There was a problem getting the wallet with that ID.' })
  }
}

export { getPosts, createPost }
