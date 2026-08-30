-- The older recursion helper uses the same SQL signature as the new actor-bound
-- community helper but a different input parameter name. Newer conversation
-- policies already stopped depending on it. Drop it with RESTRICT semantics so
-- any unexpected dependency fails safely before the replacement migration runs.

BEGIN;

DROP FUNCTION IF EXISTS authz.is_conversation_member(UUID);

COMMIT;
