CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE OR REPLACE FUNCTION generate_searchable(_nome VARCHAR, _apelido VARCHAR, _stack JSON) 
	RETURNS TEXT AS $$ 
	BEGIN 
	RETURN _nome || _apelido || _stack;
	END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE TABLE IF NOT EXISTS "pessoas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"apelido" varchar(255) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"nascimento" date NOT NULL,
	"stack" json NOT NULL,
	"searchable" text NOT NULL GENERATED ALWAYS AS (generate_searchable(nome, apelido, stack)) STORED,
	CONSTRAINT "pessoas_apelido_unique" UNIQUE("apelido")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pessoas_searchable_index" ON "pessoas" USING gist ("searchable" gist_trgm_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pessoas_apelido_index" ON "pessoas" USING btree ("apelido");