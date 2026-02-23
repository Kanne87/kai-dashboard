#!/bin/sh
set -e

echo "[entrypoint] Checking database schema..."

# Payload 3.x with push:true uses drizzle-kit under the hood.
# During `next build`, Payload tries to push schema but fails because
# DATABASE_URI is not available in the build environment (Coolify).
# 
# Solution: Run the schema push at container startup when DATABASE_URI
# is available as a runtime environment variable.
#
# We use a small inline Node.js script that imports Payload and triggers
# initialization, which includes the drizzle push.

node --experimental-specifier-resolution=node -e "
import('payload').then(async ({ getPayload }) => {
  try {
    const configModule = await import('./src/payload.config.ts').catch(() => null);
    if (!configModule) {
      console.log('[entrypoint] Could not load payload config from source, trying built config...');
      const payload = await getPayload({ config: (await import('@payloadcms/next/utilities')).importConfig('./payload.config.ts') });
      console.log('[entrypoint] Schema push completed via built config');
      await payload.db.destroy();
      process.exit(0);
    }
    const payload = await getPayload({ config: configModule.default });
    console.log('[entrypoint] Schema push completed successfully');
    await payload.db.destroy();
    process.exit(0);
  } catch (err) {
    console.error('[entrypoint] Schema push error:', err.message);
    console.log('[entrypoint] Continuing startup anyway...');
    process.exit(0);
  }
});
" 2>&1 || echo "[entrypoint] Schema push script failed, continuing..."

echo "[entrypoint] Starting server..."
exec node server.js
