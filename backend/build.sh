#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Navigate to project directory
cd Gestion_Finance

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate

# Create superuser automatically if it doesn't exist
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='ashanti').exists() or User.objects.create_superuser('ashanti', 'ashanti@example.com', '1234', role='admin')"
