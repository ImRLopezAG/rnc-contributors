import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { contributorSchema } from '@db/contributors.model'

export const rncPaginationSchema = z.object({
  total: z.number().default(0),
  totalPages: z.number().default(0),
  currentPage: z.number().default(0),
  prevPage: z.number().nullable().default(null),
  nextPage: z.number().nullable().default(null),
  data: z.array(contributorSchema),
});

export const contributorByRncSchema = createRoute({
  name: 'Get contributor by RNC',
  method: 'get',
  path: '/rnc/{rnc}',
  description: 'Returns contributor by RNC',
  summary: 'Get contributor by RNC',
  tags: ['contributors'],
  request: {
    params: z.object({
      rnc: z.string().default('123456789'),
    }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: contributorSchema,
        },
      },
    },
    404: {
      description: 'Not Found',
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Internal Server Error'),
          }),
        },
      },
    },
  },
});

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
      limit: z.string().default('10'),
    }),
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: rncPaginationSchema,
        },
      },
    },
    400: {
      description: 'Bad Request',
      summary: 'Page and limit are required',
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Internal Server Error'),
          }),
        },
      },
    },
  },
});

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
            contributors: z.number().default(0),
          }),
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Internal Server Error'),
          }),
        },
      },
    },
  },
});

export const updateFileSchema = createRoute({
  name: 'Update file',
  method: 'post',
  path: '/update',
  description: 'Update rnc data file',
  summary: 'Update DGII file to update contributors database',
  tags: ['contributors'],
  request: {
    query: z.object({
      seed: z.boolean().default(true)
    })
  },
  responses: {
    200: {
      description: 'OK',
      content: {
        'application/json': {
          schema: z.object({
            status: z.string().default('OK'),
          }),
        },
      },
    },
    400: {
      description: 'Bad Request',
      summary: 'File is required',
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().default('Internal Server Error'),
          }),
        },
      },
    },
  },
});
