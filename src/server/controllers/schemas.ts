import { contributorSchema } from '@db/contributors.model'
import { createRoute } from '@hono/zod-openapi'
import { z } from 'zod'

const exampleContributor = {
  rnc: '123456789',
  social_reason: 'Contributor Name',
  alias: 'Contributor Alias',
  economic_activity: 'Contributor Activity',
  since_date: '2021-01-01',
  status: 'Active',
  payment_type: 'Cash'
}
const examplePagination = {
  total: 1,
  totalPages: 1,
  currentPage: 1,
  prevPage: null,
  nextPage: null,
  data: [exampleContributor]
}

export const rncPaginationSchema = z.object({
  total: z.number().default(0),
  totalPages: z.number().default(0),
  currentPage: z.number().default(0),
  prevPage: z.number().nullable().default(null),
  nextPage: z.number().nullable().default(null),
  data: z.array(contributorSchema)
})

const FileRequestSchema = z.object({
  file: z
    .custom<File>((v) => v instanceof File)
    .openapi({
      type: 'string',
      format: 'binary'
    })
})

const errorSchema = (defaultMessage: string = 'Internal Server Error') =>
  z.object({ error: z.string().default(defaultMessage) })

export const contributorByRncSchema = createRoute({
  name: 'Get contributor by RNC',
  method: 'get',
  path: '/rnc/{rnc}',
  description: 'Returns contributor by RNC',
  summary: 'Get contributor by RNC',
  tags: ['contributors'],
  request: {
    params: z.object({
      rnc: z.string().default('123456789')
    })
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: contributorSchema,
          example: exampleContributor
        }
      }
    },
    404: {
      description: 'Not Found',
      content: {
        'application/json': {
          schema: errorSchema('Contributor not found')
        }
      }
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: errorSchema()
        }
      }
    }
  }
})

export const contributorsPaginationSchema = createRoute({
  name: 'Get contributors by pagination',
  method: 'get',
  path: '/list',
  description: 'Returns contributors by pagination',
  summary: 'Get contributors by pagination',
  tags: ['contributors'],
  request: {
    query: z.object({
      page: z.string().default('1'),
      limit: z.string().default('10')
    })
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: rncPaginationSchema,
          example: examplePagination
        }
      }
    },
    400: {
      description: 'Bad Request',
      summary: 'Page and limit are required',
      content: {
        'application/json': {
          schema: errorSchema('Page and limit are required')
        }
      }
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: errorSchema()
        }
      }
    }
  }
})

export const healthCheckSchema = createRoute({
  name: 'Health Check',
  method: 'get',
  path: '/health',
  description: 'Returns health check status',
  summary: 'Health Check',
  tags: ['health'],
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({
            status: z.string().default('UP'),
            contributors: z.number().default(0)
          })
        }
      }
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: errorSchema()
        }
      }
    }
  }
})

export const updateFileSchema = createRoute({
  name: 'Update file',
  method: 'post',
  path: '/update',
  description: 'Update rnc data file',
  summary: 'Update DGII file to update contributors database',
  tags: ['contributors'],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: FileRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().default('OK')
          })
        }
      }
    },
    400: {
      description: 'Bad Request',
      summary: 'File is required',
      content: {
        'application/json': {
          schema: errorSchema('File is required')
        }
      }
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: errorSchema()
        }
      }
    }
  }
})

export const contributorsByNameSchema = createRoute({
  name: 'Get contributors by name',
  method: 'get',
  path: '/name/{name}',
  description: 'Returns contributors by name',
  summary: 'Get contributors by name',
  tags: ['contributors'],
  request: {
    params: z.object({
      name: z.string().default('')
    }),
    query: z.object({
      page: z.string().default('1'),
      limit: z.string().default('10')
    })
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: rncPaginationSchema,
          example: {
            total: 1,
            totalPages: 1,
            currentPage: 1,
            prevPage: null,
            nextPage: null,
            data: [
              {
                rnc: '123456789',
                social_reason: 'Contributor Name',
                alias: 'Contributor Alias',
                economic_activity: 'Contributor Activity',
                since_date: '2021-01-01',
                status: 'Active',
                payment_type: 'Cash'
              }
            ]
          }
        }
      }
    },
    400: {
      description: 'Bad Request',
      summary: 'Name is required',
      content: {
        'application/json': {
          schema: errorSchema('Name is required')
        }
      }
    },
    404: {
      description: 'Not Found',
      content: {
        'application/json': {
          schema: errorSchema('Contributor not found')
        }
      }
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: errorSchema()
        }
      }
    }
  }
})
