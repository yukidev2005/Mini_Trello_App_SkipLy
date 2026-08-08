import 'dotenv/config'
import express from 'express'
import { json, urlencoded } from 'body-parser'
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import serviceAccount from './firebase-service-account.json'
import { authRoute } from '~/res/auth/auth.route'
import { errorHandler } from '~/utils/error-handler'
import swaggerUi from 'swagger-ui-express'
import { swaggerDocument } from '~/configs/swaggerConfig'
import cors from 'cors'
import { boardRoute } from '~/res/board/board.route'
import { authorization } from '~/middlewares/authorization'
import { githubRoute } from '~/res/github/github.route'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: '*' }))
app.use(json())
app.use(urlencoded({ extended: true }))

initializeApp({
  credential: cert(serviceAccount as ServiceAccount)
})

export const db = getFirestore()

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Trello App API is running',
    data: {
      name: 'Trello App API',
      version: '1.0.0',
      description: 'API system for booksTrello App.',
      author: 'Yuki dev',
      license: 'MIT',
      contact: {
        email: 'yukidev2005@gmail.com'
      }
    },
    timestamp: new Date().toISOString()
  })
})

app.use('/auth', authorization, authRoute)
app.use('/boards', authorization, boardRoute)
app.use('/repositories', authorization, githubRoute)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
