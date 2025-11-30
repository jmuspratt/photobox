#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
  source .env
fi

if [ -z "$DEPLOY_PATH" ]; then
  echo "Error: DEPLOY_PATH is not set"
  echo "Set it in .env file: DEPLOY_PATH=user@server:/path/to/web/root"
  exit 1
fi

echo "Source: dist/"
echo "Destination: $DEPLOY_PATH"
echo "This will DELETE files in the destination that don't exist in source!"
read -p "Are you sure? (type 'yes' to continue): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Aborted."
  exit 1
fi


rsync -azP --delete --timeout=60 -e "ssh -o ServerAliveInterval=10" dist/ "$DEPLOY_PATH"
echo "Deploy complete!"
