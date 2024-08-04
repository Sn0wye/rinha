import { sql } from 'drizzle-orm';
import {
  date,
  index,
  json,
  pgTable,
  text,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';

export const pessoas = pgTable(
  'pessoas',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    apelido: varchar('apelido').notNull().unique(),
    nome: varchar('nome', { length: 255 }).notNull(),
    nascimento: date('nascimento').notNull(),
    stack: json('stack').notNull(),
    searchable: text('searchable')
      .notNull()
      .generatedAlwaysAs(sql`generate_searchable(nome, apelido, stack)`)
  },
  t => ({
    idx_pessoas_searchable: index().using('gist', t.searchable),
    idx_pessoas_apelido: index().using('btree', t.apelido)
  })
);
