-- Superseded before first successful production apply.
--
-- The original version of this migration was rejected transactionally by
-- PostgreSQL because a PL/pgSQL loop variable collided with a temp-table column
-- name. Supabase did not record the migration and no production changes from it
-- persisted. The reviewed hardening work is split into the immediately following
-- migrations so each stage is smaller, independently auditable, and easier to
-- smoke-test.
SELECT 1;
