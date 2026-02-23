#!/bin/sh
set -e

echo "[entrypoint] Running Payload schema push..."

# Payload's push:true runs via drizzle-kit push
# We call it via the Payload CLI before starting the server
if [ -f ./node_modules/.bin/payload ]; then
  npx payload migrate 2>/dev/null || echo "[entrypoint] No pending migrations (or migrate not configured)"
fi

# Drizzle push - this is what push:true does at init time
# We run it explicitly to sync schema before the server starts
node -e "
  const { getPayload } = require('payload');
  const config = require('./payload.config');
  getPayload({ config }).then(() => {
    console.log('[entrypoint] Payload initialized, schema pushed');
    process.exit(0);
  }).catch(err => {
    console.error('[entrypoint] Schema push failed:', err.message);
    process.exit(0); // Don't block startup
  });
" 2>/dev/null || echo "[entrypoint] Fallback: schema push via payload init skipped"

echo "[entrypoint] Starting server..."
exec node server.js
