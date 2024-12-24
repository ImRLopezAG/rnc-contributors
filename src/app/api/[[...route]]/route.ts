import { api } from '@controllers/doc-controller'
import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { handle } from 'hono/vercel'

const app = new OpenAPIHono()
app.use(cors())
app.use(logger())
app.route('', api)

export const GET = handle(app)
export const POST = handle(app)
