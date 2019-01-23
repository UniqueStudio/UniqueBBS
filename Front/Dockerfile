FROM node:alpine AS build

ARG domain=https://api.bbs.hzytql.top/

ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

WORKDIR /usr/src/app
COPY . .
ENV DOMAIN=${domain}
RUN yarn build

FROM nginx:stable
COPY --from=build /usr/src/app/dist/ /var/www/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["-g", "daemon off;"]
ENTRYPOINT ["nginx"]