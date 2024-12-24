#!/usr/bin/env bash
# Use this script to start a Docker container for a local development database

DB_CONTAINER_NAME="rnc-contributors-db"

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo -e "Docker is not installed. Please install Docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

# Check if the container is already running
if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  echo "Database container '$DB_CONTAINER_NAME' is already running"
  exit 0
fi

# Check if the container exists but is stopped
if [ "$(docker ps -q -a -f name=$DB_CONTAINER_NAME)" ]; then
  docker start "$DB_CONTAINER_NAME"
  echo "Existing database container '$DB_CONTAINER_NAME' started"
  exit 0
fi

# Load environment variables from .env
if [ -f ".env" ]; then
  set -a
  source .env
  set +a
else
  echo "No .env file found. Please create one with a valid DATABASE_URL variable."
  exit 1
fi

# Extract password and port from DATABASE_URL
DB_PASSWORD=$(echo "$DATABASE_URL" | awk -F':' '{print $3}' | awk -F'@' '{print $1}')
DB_PORT=$(echo "$DATABASE_URL" | awk -F':' '{print $4}' | awk -F'/' '{print $1}')

# Validate extracted values
if [ -z "$DB_PASSWORD" ] || [ -z "$DB_PORT" ]; then
  echo "Failed to extract database credentials from DATABASE_URL. Please check the .env file."
  exit 1
fi

# If the default password is being used, generate a random one
if [ "$DB_PASSWORD" = "password" ]; then
  echo "Default password detected. Generating a new random password..."
  DB_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_')
  # Update the .env file with the new password
  sed -i.bak "s#:password@#:$DB_PASSWORD@#" .env && echo "Updated .env with a new password."
fi

# Run the Docker container
docker run -d \
  --name "$DB_CONTAINER_NAME" \
  -e POSTGRES_USER="postgres" \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB="$DB_CONTAINER_NAME" \
  -p "$DB_PORT":5432 \
  postgres:alpine

# Display the result
if [ $? -eq 0 ]; then
  echo "Database container '$DB_CONTAINER_NAME' was successfully created!"
  echo "Password: $DB_PASSWORD"
  echo "Connection URL: postgres://postgres:$DB_PASSWORD@localhost:$DB_PORT/$DB_CONTAINER_NAME"
else
  echo "Failed to create the database container."
  exit 1
fi