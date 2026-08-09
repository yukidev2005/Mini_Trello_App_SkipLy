import { Router } from 'express'
import { sendVerifyCodeController, signinController, signupController } from '~/res/auth/auth.controller'

export const authRoute = Router()

authRoute.post('/signin', signinController)
authRoute.post('/signup', signupController)
authRoute.post('/send-code', sendVerifyCodeController)
