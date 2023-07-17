import { Router } from 'express'
import express, { NextFunction, Request, Response } from 'express'
import { ErrorCode, ErrorException } from '../../utils/'

const router = Router();

router.get('/', (req,res) => {
    console.log("wallet");    
});


export default {
  baseUrl: '/wallets',
  router,
  auth: true
}