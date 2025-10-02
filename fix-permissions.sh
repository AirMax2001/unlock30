#!/bin/bash

# Script per risolvere problemi di permessi su Render

echo "🔧 Fixing permissions for vue-cli-service..."

# Trova e fixa i permessi per vue-cli-service
find ./frontend/node_modules/.bin -name "vue-cli-service" -exec chmod +x {} \; 2>/dev/null || true
find ./node_modules/.bin -name "vue-cli-service" -exec chmod +x {} \; 2>/dev/null || true

echo "✅ Permissions fixed"
