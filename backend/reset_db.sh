#!/bin/bash

echo "Dropping tables..."
psql -U recipe_user -d recipe_app_db -h localhost << SQL
DROP TABLE IF EXISTS swipes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS alembic_version CASCADE;
SQL

echo "Removing old migrations..."
rm -rf alembic/versions/*.py
rm -rf alembic/versions/__pycache__

echo "Loading recipes..."
psql -U recipe_user -d recipe_app_db -h localhost -f backend/static/data/recipes\(used\).sql

echo "Creating users and swipes tables..."
psql -U recipe_user -d recipe_app_db -h localhost << SQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE swipes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    liked BOOLEAN NOT NULL,
    taste_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    dish_type JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT NOW()
);
SQL

echo "Done! Database reset complete."
