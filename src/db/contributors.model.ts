import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createSelectSchema } from 'drizzle-zod';

export const contributors = sqliteTable(
  'contributors',
  {
    rnc: text('rnc'),
    social_reason: text('social_reason'),
    alias: text('alias'),
    economic_activity: text('economic_activity'),
    status: text('status'),
    payment_type: text('payment_type'),
  },
  (t) => [index('contributors_rnc_index').on(t.rnc)]
);

export const contributorSchema = createSelectSchema(contributors);
