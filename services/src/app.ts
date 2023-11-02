import express, { type Request, type Response, type NextFunction } from 'express'
import { json } from 'body-parser'

import sampleRouter from './routes/sample'

const app = express()

app.use(json())

app.use('/sample', sampleRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message })
})

app.listen(3000)
