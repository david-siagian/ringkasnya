# Cloudflare D1 Migrations

Direktori ini menyimpan file migrasi SQL berurutan (mis. `0001_initial_schema.sql`) untuk database Cloudflare D1 `ringkasnya`.

## Perintah Migrasi

- **Lokal (Miniflare / dev):**
  ```bash
  npx wrangler d1 migrations apply ringkasnya-db --local
  ```
- **Preview (`dev`):**
  ```bash
  npx wrangler d1 migrations apply ringkasnya-db --remote --preview
  ```
- **Production (`main`):**
  ```bash
  npx wrangler d1 migrations apply ringkasnya-db --remote
  ```
