-- Fase 3.1B: Tambah kolom username & display_username untuk plugin username Better Auth
ALTER TABLE users ADD COLUMN username TEXT;
ALTER TABLE users ADD COLUMN display_username TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
