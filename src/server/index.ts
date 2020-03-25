import express from 'express'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import config from '../../nuxt.config'

const app = express()

// Import and Set Nuxt.js options
const isDev = process.env.NODE_ENV !== 'production'

const start = async () => {
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

  // Listen the server
  const { host, port } = nuxt.options.server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
