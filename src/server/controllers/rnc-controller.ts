import {
  contributorByRncSchema,
  contributorsByNameSchema,
  contributorsPaginationSchema,
  updateFileSchema
} from '@controllers/schemas'

import { OpenAPIHono } from '@hono/zod-openapi'
import { rncService } from '@services/rnc-service'

export const contributorsRouter = new OpenAPIHono()

contributorsRouter.openapi(contributorsPaginationSchema, async (c) => {
  try {
    const { page, limit } = c.req.query()

    if (!page || !limit) {
      return c.json({ error: 'Page and limit are required' }, 400)
    }

    const pagination = await rncService().paginateContributors(
      Number(page),
      Number(limit)
    )

    return c.json(pagination, 200)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

contributorsRouter.openapi(contributorByRncSchema, async (c) => {
  try {
    const { rnc } = c.req.param()

    const contributor = await rncService().getContributor(rnc)

    if (!contributor) {
      return c.json({ error: `Contributor with RNC ${rnc} not found` }, 404)
    }

    return c.json(contributor, 200)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

contributorsRouter.openapi(contributorsByNameSchema, async (c) => {
  try {
    const { name } = c.req.param()
    const { page, limit } = c.req.query()
    if (!name) return c.json({ error: 'Name is required' }, 400)

    if (!page || !limit)
      return c.json({ error: 'Page and limit are required' }, 400)

    const contributors = await rncService().findByName(
      name,
      Number(page),
      Number(limit)
    )

    if (contributors.data.length === 0)
      return c.json({ error: `Contributors with name ${name} not found` }, 404)

    return c.json(contributors, 200)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

contributorsRouter.openapi(updateFileSchema, async (c) => {
  try {
    const { file } = await c.req.parseBody()

    if (!file) return c.json({ error: 'File is required' }, 400)

    if (typeof file === 'string') {
      return c.json({ error: 'Invalid file' }, 400)
    }
    if (['text/csv', 'text/plain'].every((type) => type !== file.type)) {
      return c.json({ error: `Invalid file type: ${file.type}` }, 400)
    }
    await rncService().updateContributorsFile(await file.text())
    return c.json({ message: 'File received' }, 200)
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500)
    }
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})
