import { test } from 'node:test';
import Fastify from 'fastify';

test('check rawBody', async () => {
  const app = Fastify();
  app.post('/test', { config: { rawBody: true } }, async (req, reply) => {
    const raw = (req as any).rawBody;
    return reply.send({ raw: !!raw });
  });
  const res = await app.inject({
    method: 'POST',
    url: '/test',
    headers: { 'content-type': 'application/json' },
    payload: '{"a":1}',
  });
  console.log(res.payload);
  await app.close();
});
