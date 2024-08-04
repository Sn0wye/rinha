import { count, eq, sql } from 'drizzle-orm';
import { db } from '.';
import { pessoas } from './schema';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';

function lower(value: AnyPgColumn) {
  return sql`lower(${value})`;
}

export const selectPessoaById = db
  .select({
    id: pessoas.id,
    apelido: pessoas.apelido,
    nome: pessoas.nome,
    nascimento: pessoas.nascimento,
    stack: pessoas.stack
  })
  .from(pessoas)
  .where(eq(pessoas.id, sql.placeholder('id')))
  .prepare(`selectPessoaById`);

export const selectPessoaByApelido = db
  .select({
    id: pessoas.id,
    apelido: pessoas.apelido,
    nome: pessoas.nome,
    nascimento: pessoas.nascimento,
    stack: pessoas.stack
  })
  .from(pessoas)
  .where(eq(pessoas.apelido, sql.placeholder('apelido')))
  .prepare(`selectPessoaByApelido`);

export const searchPessoasByTerm = db
  .select({
    id: pessoas.id,
    apelido: pessoas.apelido,
    nome: pessoas.nome,
    nascimento: pessoas.nascimento,
    stack: pessoas.stack
  })
  .from(pessoas)
  .where(sql`${lower(pessoas.searchable)} ilike ${sql.placeholder('term')}`)
  .prepare(`searchPessoasByTerm`);

export const countPessoas = db
  .select({ count: count() })
  .from(pessoas)
  .prepare(`countPessoas`);
