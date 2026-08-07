import { Router } from 'express'
import { sentVerifyCodeController, signinController, signupController } from '~/res/auth/auth.controller'

export const authRoute = Router()

authRoute.post('/signin', signinController)
authRoute.post('/signup', signupController)
authRoute.post('/send-code', sentVerifyCodeController)
