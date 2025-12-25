#!/bin/sh
set -e

echo "🚀 Starting application deployment..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
MAX_WAIT=60
WAIT_COUNT=0
until node -e "
  try {
    const knexfile = require('./dist/config/knexfile.js');
    const config = knexfile.default || knexfile;
    const knexConfig = config.production || config['production'] || config;
    const knex = require('knex')(knexConfig);
    knex.raw('SELECT 1')
      .then(() => {
        console.log('✅ Database is ready');
        knex.destroy();
        process.exit(0);
      })
      .catch((err) => {
        console.error('Database connection error:', err.message);
        knex.destroy().catch(() => {});
        setTimeout(() => process.exit(1), 1000);
      });
  } catch (err) {
    console.error('Knex initialization error:', err.message);
    process.exit(1);
  }
" 2>&1; do
  WAIT_COUNT=$((WAIT_COUNT + 1))
  if [ $WAIT_COUNT -ge $MAX_WAIT ]; then
    echo "❌ Database wait timeout after $MAX_WAIT attempts"
    exit 1
  fi
  echo "⏳ Waiting for database... (attempt $WAIT_COUNT/$MAX_WAIT)"
  sleep 2
done

# Run migrations
echo "📦 Running database migrations..."
NODE_ENV=production
if command -v pnpm >/dev/null 2>&1; then
  NODE_ENV=production pnpm exec knex migrate:latest --knexfile dist/config/knexfile.js --env production || {
    echo "⚠️  Migrations completed or already up to date"
  }
elif [ -f "node_modules/.bin/knex" ]; then
  NODE_ENV=production node_modules/.bin/knex migrate:latest --knexfile dist/config/knexfile.js --env production || {
    echo "⚠️  Migrations completed or already up to date"
  }
elif [ -f "node_modules/knex/bin/cli.js" ]; then
  NODE_ENV=production node node_modules/knex/bin/cli.js migrate:latest --knexfile dist/config/knexfile.js --env production || {
    echo "⚠️  Migrations completed or already up to date"
  }
else
  echo "⚠️  Knex not found, skipping migrations"
fi

# Run seeds (only if needed - you can add a flag to control this)
if [ "${RUN_SEEDS:-false}" = "true" ]; then
  echo "🌱 Running database seeds..."
  if command -v pnpm >/dev/null 2>&1; then
    pnpm exec knex seed:run --knexfile dist/config/knexfile.js --env production || {
      echo "⚠️  Seeds completed or already run"
    }
  elif [ -f "node_modules/.bin/knex" ]; then
    node_modules/.bin/knex seed:run --knexfile dist/config/knexfile.js --env production || {
      echo "⚠️  Seeds completed or already run"
    }
  elif [ -f "node_modules/knex/bin/cli.js" ]; then
    node node_modules/knex/bin/cli.js seed:run --knexfile dist/config/knexfile.js --env production || {
      echo "⚠️  Seeds completed or already run"
    }
  else
    echo "⚠️  Knex not found, skipping seeds"
  fi
else
  echo "ℹ️  Skipping seeds (set RUN_SEEDS=true to run seeds)"
fi

# Start the application
echo "🎯 Starting application server..."
exec node dist/server.js

