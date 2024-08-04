import { Type } from '@sinclair/typebox';

export const pessoaValidator = Type.Object({
  apelido: Type.String({ minLength: 1, maxLength: 32 }),
  nome: Type.String({ minLength: 1, maxLength: 100 }),
  nascimento: Type.RegExp(/^\d{4}-\d{2}-\d{2}$/),
  stack: Type.Array(Type.String({ minLength: 1, maxLength: 32 }))
});
