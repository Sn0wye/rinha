import { Hono } from 'hono';
import { env } from './env';
import { tbValidator } from '@hono/typebox-validator';
import { db } from './db';
import { pessoas } from './db/schema';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import {
  countPessoas,
  searchPessoasByTerm,
  selectPessoaByApelido,
  selectPessoaById
} from './db/prepared';
import { pessoaValidator } from './validators';

const app = new Hono();

const isIdValid = (id: string) => {
  try {
    z.string().uuid().parse(id);
    return true;
  } catch {
    return false;
  }
};

app.get('/', c => {
  return c.json({
    hello: 'world!'
  });
});

app.post(
  '/pessoas',
  tbValidator('json', pessoaValidator, (result, c) => {
    if (!result.success) {
      return c.status(400);
    }
  }),
  async c => {
    const pessoa = c.req.valid('json');

    const id = uuid();
    try {
      const exists = await selectPessoaByApelido.execute({
        apelido: pessoa.apelido
      });

      if (exists.length > 0) {
        return c.status(422);
      }

      await db.insert(pessoas).values({
        id,
        ...pessoa
      });

      c.header('Location', `/pessoa/${id}`);
      return c.body(null, 201);
    } catch {
      return c.status(422);
    }
  }
);

app.get('/pessoas', async c => {
  const term = c.req.query('t');

  if (!term) {
    return c.status(400);
  }

  const results = await searchPessoasByTerm.execute({ term: `%${term}%` });

  return c.json(results, 200);
});

app.get('/pessoas/:id', async c => {
  const id = c.req.param('id');

  if (!isIdValid(id)) {
    return c.status(404);
  }

  const pessoa = await selectPessoaById.execute({ id });

  return c.json(pessoa, 200);
});

app.get('/contagem-pessoas', async c => {
  const result = await countPessoas.execute();
  return c.text(result[0].count.toString(), 200);
});

export default {
  port: env.PORT,
  fetch: app.fetch
};
