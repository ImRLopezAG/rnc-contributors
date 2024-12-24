import { healthCheckSchema } from '@controllers/schemas'
import { contributorsRouter } from '@controllers/rnc-controller'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { rncService } from '@services/rnc-service'

export const api = new OpenAPIHono().basePath('/api')

api.route('contributors', contributorsRouter)

api.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'RNC Contributors API',
    description:
      'This API provides information about contributors registered in the Dominican Republic.',
    version: 'v1',
    contact: {
      email: 'contact@imrlopez.dev',
      name: 'Angel Gabriel Lopez',
      url: 'https://imrlopez.dev'
    }
  },
  tags: [
    {
      name: 'contributors',
      description: 'Contributors endpoints'
    },
    {
      name: 'health',
      description: 'Health check endpoint'
    }
  ]
})

api.openapi(healthCheckSchema, async (c) => {
  try {
    const healthCheck = await rncService().healthCheck()
    return c.json({ ...healthCheck }, 200)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

api.get(
  '/swagger',
  swaggerUI({
    url: '/api/openapi.json',
    syntaxHighlight: true
  })
)

api.get(
  '/',
  apiReference({
    spec: {
      url: '/api/openapi.json'
    },
    pageTitle: 'RNC Contributors API',
    layout: 'modern',
    theme: 'deepSpace',
    hideDownloadButton: true
  })
)
