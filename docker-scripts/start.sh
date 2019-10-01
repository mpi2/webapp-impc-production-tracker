#!/bin/sh

if [ -n "${API_SERVICE_HOST}" ]; then
   /bin/sed -i 's/127\.0\.0\.1/'"${API_SERVICE_HOST}"'/g' /usr/share/nginx/html/assets/config/config.json
fi

if [ -n "${API_SERVICE_PORT}" ]; then
   /bin/sed -i 's/8080/'"${API_SERVICE_PORT}"'/g' /usr/share/nginx/html/assets/config/config.json
fi

if [ -n "${APP_BASE_PATH}" ]; then
   /bin/sed -i 's/"baseUrl": ""/"baseUrl": "'"${APP_BASE_PATH}"'"/g' /usr/share/nginx/html/assets/config/config.json
fi

/usr/sbin/nginx -g 'daemon off;'
