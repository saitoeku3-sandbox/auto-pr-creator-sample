import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import consola from 'consola'
import errors from 'http-errors'
import { Nuxt, Builder } from 'nuxt'
import { index, update } from '../api/virtual-beings'
import config from '../../nuxt.config'

const app = express()

const wrap = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  fn(req, res, next)
    .then((data: unknown) => {
      res.status(200).json(data)
    })
    .catch(next)
}

// Import and Set Nuxt.js options
const isDev = process.env.NODE_ENV !== 'production'

const start = async () => {
  app.use(bodyParser.json())
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

  // Routes
  app.get('/api', (req, res) => res.send('hello world'))
  app.get('/api/virtual-beings', wrap(index))
  app.post('/api/virtual-beings', wrap(update))

  // Init Nuxt.js
  const nuxt = new Nuxt(config)
  await nuxt.ready()

  // Build only in dev mode
  if (isDev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  app.use((req, res, next) => {
    next(new errors.NotFound())
  })

  app.use((err: any, req, res: any) => {
    const code = err.statusCode || 500
    res.status(code).json({
      code,
      error: err.message,
    })
  })

  // Listen the server
  const { host, port } = nuxt.options.server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  })
}

start()
