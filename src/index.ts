import { env } from '@config/env';
import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { api } from '@controllers/doc-controller';
import { cors } from 'hono/cors';

const { PORT: port } = env();

const app = new OpenAPIHono();
app.use(cors());
app.route('', api)

app.get('/', (c) => {
  return c.redirect('/api');
})

serve(
  {
    fetch: app.fetch,
    port,
  },
  (address) => {
    console.log(
      `🔥 Hono server listening on http://localhost:${address.port}`
    );
  }
);
