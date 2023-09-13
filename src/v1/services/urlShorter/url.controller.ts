import Services from '../../helpers/model.helper'
import { clientResponse } from '../../helpers/response'
import Logger from '../../libs/logger'
import Url from './url.model'
import axios from 'axios'

const UrlService = new Services(Url)

// map link
const mapLink = async (req: any, res: any) => {
  try {
    const { longLink } = req.body

    const existingLink = await UrlService.getOne({ longLink })

    if (existingLink) {
      return clientResponse(res, 201, {
        shortLink: existingLink.shortLink,
        visitors: existingLink.visitors
      })
    }

    // genrate 5 random characters
    const shortLink = Math.random().toString(36).substring(2, 7)

    const newLink = await UrlService.create({ longLink, shortLink: shortLink, visitors: 0 })

    clientResponse(res, 201, {
      shortLink: `https://digitalize-7057ce3eda07.herokuapp.com/v1/url/${newLink.shortLink}`,
      visitors: newLink.visitors
    })
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving urls' })
  }
}

const redirectToLink = async (req: any, res: any) => {
  try {
    const { id } = req.params

    // console.log(req.params);

    const existingLink = await UrlService.getOne({ shortLink: id })

    if (existingLink) {
      await UrlService.update(existingLink._id, { visitors: existingLink.visitors + 1 })

      return res.redirect(existingLink.longLink)
    }

    clientResponse(res, 404, { message: 'link not found' })
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving urls' })
  }
}

const getLinkDetails = async (req: any, res: any) => {
  try {
    const { shortLink } = req.body

    const existingLink = await UrlService.getOne({ shortLink })

    if (existingLink) {
      return clientResponse(res, 201, {
        shortLink: existingLink.shortLink,
        visitors: existingLink.visitors
      })
    }

    clientResponse(res, 404, { message: 'link not found' })
  } catch (error: any) {
    Logger.error(`${error.message}`)

    clientResponse(res, 400, { error: error.message, message: 'there was a problem retrieving urls' })
  }
}


const getUrls = async (req: any , res: any) =>
{

 const response = await axios
    .get('https://app.scrapingbee.com/api/v1/store/google', {
      params: {
        api_key: 'PKHB0EDEHDASVVRCGQS4E4Y09MUO1HLN29M28LYY5LA4NOUFA8CAHUR1MTW9BHY0XD8RE3V179EBAZT6',
        search: 'remote software engineering apply.workable.com/*'
      }
    })
  
  const organicResults = response.data.organic_results

  const urls = organicResults.map((organicResult: any) => organicResult.url)

     return clientResponse(res, 201, {
      urls
     })
}

export { mapLink, redirectToLink, getLinkDetails, getUrls }
