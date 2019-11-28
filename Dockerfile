## Stage 1, "build-stage", based on Node.js, to build and compile Angular

FROM node:lts-buster as build-stage


COPY package*.json ./

RUN npm install -g npm && npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer
## will prevent unnecessary npm installs at each build
RUN npm install && mkdir /app && cp -R ./node_modules ./app


WORKDIR /app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN $(npm bin)/ng lint && npm audit && $(npm bin)/ng build --prod --build-optimizer --output-path=./dist/out --base-href ./ --deploy-url ./




# Stage 2, based on Nginx, to have only the compiled app, ready for production with Nginx

FROM nginx:mainline-alpine


# Copy the default nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf


# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*


## From 'builder' stage copy the artifacts in dist folder to default nginx public folder
COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html

COPY docker-scripts/start.sh /

RUN ["chmod", "+x", "/start.sh"]

ENTRYPOINT ["/start.sh"]
