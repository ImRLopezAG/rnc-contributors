import { cache } from '@config/cache';

import {
  contributorByRncSchema,
  contributorsByNameSchema,
  contributorsPaginationSchema,
  updateFileSchema,
} from '@config/schemas';

import { OpenAPIHono } from '@hono/zod-openapi';
import { rncService } from '@services/rnc-service';

export const contributorsRouter = new OpenAPIHono();

contributorsRouter.openapi(contributorsPaginationSchema, async (c) => {
  try {
    const { page, limit } = c.req.query();

    if (!page || !limit) {
      return c.json({ error: 'Page and limit are required' }, 400);
    }

    const cacheKey = `contributors:${page}:${limit}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return c.json(cachedData);
    }
    const pagination = await rncService().paginateContributors(
      Number(page),
      Number(limit)
    );

    cache.set(cacheKey, pagination);

    return c.json(pagination);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

contributorsRouter.openapi(contributorByRncSchema, async (c) => {
  try {
    const { rnc } = c.req.param();
    const cacheKey = `contributor:${rnc}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return c.json(cachedData);
    }

    const contributor = await rncService().getContributor(rnc);

    if (!contributor) {
      return c.json({ error: `Contributor with RNC ${rnc} not found` }, 404);
    }

    cache.set(cacheKey, contributor);
    return c.json(contributor);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

contributorsRouter.openapi(updateFileSchema, async (c) => {
  try {
    const { file } = await c.req.parseBody();
    if (!file) {
      return c.json({ error: 'File is required' }, 400);
    }

    if (typeof file === 'string') {
      return c.json({ error: 'Invalid file' }, 400);
    }
    if (
      file.type !== 'text/csv' &&
      file.type !== 'application/text' &&
      file.type !== 'text/plain'
    ) {
      return c.json({ error: `Invalid file type: ${file.type}` }, 400);
    }
    console.log(file);
    await rncService().updateContributorsFile(await file.text());
    return c.json({ message: 'File received' });
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

contributorsRouter.openapi(contributorsByNameSchema, async (c) => {
  try {
    const { name } = c.req.param();
    const { page, limit } = c.req.query();
    if (!name) {
      return c.json({ error: 'Name is required' }, 400);
    }

    if (!page || !limit) {
      return c.json({ error: 'Page and limit are required' }, 400);
    }

    const contributors = await rncService().findByName(name, Number(page), Number(limit));

    if (contributors.data.length === 0) {
      return c.json({ error: `Contributor with name ${name} not found` }, 404);
    }

    return c.json(contributors);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 500);
    }
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});
