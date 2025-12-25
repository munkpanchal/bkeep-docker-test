#!/bin/sh
set -e

echo "🎯 Starting application server..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until node -e "
  const { Client } = require('pg');
  const client = new Client({
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'bkeep',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  });
  client.connect()
    .then(() => {
      console.log('✅ Database is ready');
      client.end();
      process.exit(0);
    })
    .catch((err) => {
      console.log('⏳ Database not ready yet...');
      client.end();
      process.exit(1);
    });
" 2>/dev/null; do
  sleep 2
done

# Wait for Redis to be ready (if REDIS_HOST is set)
if [ -n "$REDIS_HOST" ]; then
  echo "⏳ Waiting for Redis to be ready..."
  until node -e "
    const redis = require('redis');
    const client = redis.createClient({
      socket: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379')
      },
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB || '0')
    });
    client.connect()
      .then(() => {
        console.log('✅ Redis is ready');
        client.quit();
        process.exit(0);
      })
      .catch((err) => {
        console.log('⏳ Redis not ready yet...');
        client.quit();
        process.exit(1);
      });
  " 2>/dev/null; do
    sleep 2
  done
fi

# Run migrations
echo "🔄 Running database migrations..."
if [ -f "node_modules/.bin/knex" ]; then
  node_modules/.bin/knex migrate:latest --knexfile dist/config/knexfile.js --env production || {
    echo "⚠️ Migration failed, trying alternative path..."
    node -e "require('knex')(require('./dist/config/knexfile.js').default.production).migrate.latest().then(() => process.exit(0)).catch(e => {console.error(e); process.exit(1);})"
  }
else
  echo "⚠️ Knex not found, skipping migrations"
fi

# Run seeds if requested
if [ "$RUN_SEEDS" = "true" ]; then
  echo "🌱 Running database seeds..."
  if [ -f "node_modules/.bin/knex" ]; then
    node_modules/.bin/knex seed:run --knexfile dist/config/knexfile.js --env production || {
      echo "⚠️ Seeding failed, trying alternative path..."
      node -e "require('knex')(require('./dist/config/knexfile.js').default.production).seed.run().then(() => process.exit(0)).catch(e => {console.error(e); process.exit(1);})"
    }
  else
    echo "⚠️ Knex not found, skipping seeds"
  fi
fi

# Start the server
echo "🚀 Starting server..."
exec node -r dotenv/config dist/server.js

