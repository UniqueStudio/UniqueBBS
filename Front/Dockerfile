FROM node:alpine AS build

ADD package.json /tmp/package.json
RUN cd /tmp && yarn
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

WORKDIR /usr/src/app
COPY . .
RUN yarn build

FROM nginx:stable
COPY --from=build /usr/src/app/dist/ /var/www/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["-g", "daemon off;"]
ENTRYPOINT ["nginx"]