import { Router } from 'express'
import express, { NextFunction, Request, Response } from 'express'
import { ErrorCode, ErrorException } from '../../utils'
import upload from '../../utils/multer';
import { clientResponse } from '../../helpers/response';
import cloudinary from '../../utils/cloudinary';
import fs from 'fs';
import Logger from '../../libs/logger';
import { uploadImage } from "./uploads.controller";



const router = Router();


router.post('/', upload.array('images', 10), uploadImage );


export default {
  baseUrl: '/uploads',
  router,
  auth: false
}