FROM node:14 as build-env

WORKDIR /project
COPY . ./

RUN ls -la . && ls -la ./src

RUN npm install
RUN npm run build:prod

FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-env /project/dist /usr/share/nginx/html
COPY docker-image/nginx.conf /etc/nginx/conf.d/default.conf
