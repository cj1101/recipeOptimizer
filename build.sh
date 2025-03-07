#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install system dependencies for PostgreSQL
apt-get update -y
apt-get install -y libpq-dev gcc python3-dev

# Install Python dependencies
pip install -r requirements.txt

# Make migrations if applicable
# python manage.py migrate
