import { db } from '@server/db';
import { cache } from '@config/cache';
import { rncPaginationSchema } from '@config/schemas';
import { contributors, contributorSchema } from '@db/contributors.model';
import type { z } from '@hono/zod-openapi';

type RNCContributor = z.infer<typeof contributorSchema>;
type Pagination = z.infer<typeof rncPaginationSchema>;

const csvReader = (data: string, separator: string = ','): string[][] => {
  if (!data) {
    throw new Error('Input data is empty');
  }
  return data.split('\n').map((row) => {
    return row.split(separator).map((cell) => cell.trim().replace(/"/g, ''));
  });
};

const trim = (data: string): string => {
  if (!data) return '';
  return data
    .trim()
    .replace(/"/g, '')
    .replace(/\s+/g, ' ')
    .replace(/,/g, ' ')
    .replace(/;/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/\t/g, ' ')
    .replace(/\n/g, ' ');
};

export const rncService = () => ({
  getContributors: (fileData: string): Map<string, RNCContributor> => {
    const data = csvReader(fileData, '|')
      .map((row) => {
        const [
          rnc,
          socialReason,
          alias,
          economicActivity,
          ,
          ,
          ,
          ,
          sinceDate,
          status,
          paymentType,
        ] = row;
        return {
          rnc: trim(rnc),
          social_reason: trim(socialReason),
          alias: trim(alias),
          economic_activity: trim(economicActivity),
          since_date: trim(sinceDate),
          status: trim(status),
          payment_type: trim(paymentType),
        };
      })
      .filter((contributor) => contributor.rnc !== '');
    const dataset = new Map<string, RNCContributor>(
      data.map((contributor) => [contributor.rnc, contributor])
    );
    return dataset;
  },
  getContributor: async (rnc: string): Promise<RNCContributor | undefined> => {
    await rncService().pingData();
    const CACHE_KEY = `contributor:${rnc}`;
    const cachedData = cache.get<RNCContributor>(CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }
    const contributor = await db.query.contributors.findFirst({
      where: ({ rnc: db_rnc }, { eq }) => eq(db_rnc, rnc),
    });
    if (!contributor) {
      return undefined;
    }
    cache.set(CACHE_KEY, contributor);
    return contributor;
  },
  paginateContributors: async (
    page: number,
    limit: number
  ): Promise<Pagination> => {
    await rncService().pingData();
    const CACHE_KEY = `contributors:${page}:${limit}`;
    const cachedData = cache.get<Pagination>(CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }
    const contributors = await db.query.contributors.findMany({
      offset: page,
      limit,
    });
    const pagination = rncService().createPagination(contributors, page, limit);
    cache.set(CACHE_KEY, pagination);
    return pagination;
  },
  healthCheck: async () => {
    await rncService().pingData();
    const TOTAL_CONTRIBUTORS_KEY = 'totalContributors';
    const cachedData = cache.get<number>(TOTAL_CONTRIBUTORS_KEY);
    if (cachedData) {
      return {
        status: 'ok',
        contributors: cachedData,
      };
    }
    const contributors = await db.run('SELECT COUNT(*) as TOTAL FROM contributors');
    const total = contributors.rows[0][0];
    cache.set(TOTAL_CONTRIBUTORS_KEY, total);
    return {
      status: 'ok',
      contributors: total,
    };
  },
  findByName: async (name: string, page: number,
    limit: number): Promise<Pagination> => {
    await rncService().pingData();
    const CACHE_KEY = `contributors:${name}:${page}:${limit}`;
    const cachedData = cache.get<Pagination>(CACHE_KEY);
    if (cachedData) {
      return cachedData;
    }
    const contributors = await db.query.contributors.findMany({
      where: ({ social_reason: db_name }, { like }) => like(db_name, `${name.toUpperCase()}%`),
      offset: page,
      limit
    });
    const pagination = rncService().createPagination(contributors, page, limit);
    cache.set(CACHE_KEY, pagination);
    return pagination;
  },
  updateContributorsFile: async (data: string) => {
    const splitDataInChunks = (data: RNCContributor[], chunkSize: number) => {
      const chunks = [];
      for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
      }
      return chunks;
    };
    const contributorsSeed = rncService().getContributors(data);
    const values = Array.from(contributorsSeed.values());
    const chunks = splitDataInChunks(values, 1500);
    if (!chunks.length) {
      throw new Error('No data to insert');
    }
    if ((await db.query.contributors.findMany()).length > 0) {
      await db.delete(contributors);
    }
    for (const chunk of chunks) {
      await db.insert(contributors).values(chunk);
    }
  },
  pingData: async () => {
    const ping_db = await db.run('SELECT 1');
    if (!ping_db) {
      throw new Error('Database is down');
    }
    const contributors = await db.run('SELECT COUNT(*) as TOTAL FROM contributors');
    const ping_data = contributors.rows[0][0]
    if (ping_data === 0) {
      throw new Error('Data is empty');
    }
  },
  createPagination: (data: RNCContributor[], page: number, limit: number): Pagination => {
    const start = (page - 1) * limit;
    const end = page * limit;
    const totalPages = Math.ceil(data.length / limit);
    return {
      total: data.length,
      totalPages,
      currentPage: page,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      data: data.slice(start, end),
    };
  }
});
