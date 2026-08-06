import { Router } from 'express'
import {
  sentVerifyCodeController,
  signinController,
  signupController,
  validateOtpController
} from '~/res/auth/auth.controller'

export const authRoute = Router()

authRoute.post('/signin', signinController)
authRoute.post('/signup', signupController)
authRoute.post('/send-code', sentVerifyCodeController)
authRoute.post('/validate-otp', validateOtpController)
