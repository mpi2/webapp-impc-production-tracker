#!/bin/bash
set -e

if [ -n "${API_SERVICE_HOST}" ]; then
   sed -i 's/127\.0\.0\.1/'"${API_SERVICE_HOST}"'/g' /usr/share/nginx/html/assets/config/config.json
fi

if [ -n "${API_SERVICE_PORT}" ]; then
   sed -i 's/8080/'"${API_SERVICE_PORT}"'/g' /usr/share/nginx/html/assets/config/config.json
fi

nginx -g daemon off;
