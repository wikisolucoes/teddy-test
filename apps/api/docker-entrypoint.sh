#!/bin/sh
set -e

echo "🔄 Running database migrations..."
node -e "
const { DataSource } = require('typeorm');
const { writeDataSourceOptions } = require('./typeorm.config.js');

const dataSource = new DataSource(writeDataSourceOptions);

dataSource.initialize()
  .then(() => {
    console.log('✅ Database connected');
    return dataSource.runMigrations();
  })
  .then(() => {
    console.log('✅ Migrations completed');
    return dataSource.destroy();
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  });
"

echo "🚀 Starting application..."
exec node main.js
