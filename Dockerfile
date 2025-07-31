## Stage 1, "build-stage", based on Node.js, to build and compile Angular
FROM node:lts-bookworm AS build-stage

# Set the working directory
WORKDIR /app

# Copy only the package.json and package-lock.json files
COPY package*.json ./

# Install npm and global packages, then remove unnecessary files
RUN npm install -g npm increase-memory-limit && \
    npm set progress=false && \
    npm config set depth 0 && \
    rm -rf node_modules

# Install project dependencies
RUN npm install increase-memory-limit

# Copy the entire application
COPY . .

# Set the environment variable for increased heap size
ENV NODE_OPTIONS="--max_old_space_size=4096"

# Build the Angular app in production mode and store the artifacts in the 'dist' folder
RUN node_modules/.bin/ng lint && \
    npm audit --omit=dev && \
    node_modules/.bin/ng build --configuration=production --output-path=./dist/out --base-href ./ --deploy-url ./

## Stage 2, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:mainline-alpine

# Copy the nginx configuration files
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# From the 'build-stage' copy the artifacts in 'dist' folder to the default nginx public folder
COPY --from=build-stage /app/dist/out/browser/ /usr/share/nginx/html

# Set ownership of the nginx html folder and start script
RUN chown -R nginx:nginx /usr/share/nginx/html
COPY docker-scripts/start.sh /
RUN chmod +x /start.sh && chown nginx:nginx /start.sh

# Set the entrypoint for the container
ENTRYPOINT ["/start.sh"]

# Switch to the 'nginx' user
USER nginx
