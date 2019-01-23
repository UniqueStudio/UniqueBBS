FROM node:alpine AS build

ADD ./Back/package.json /tmp/package.json
ADD ./Back/yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

WORKDIR /usr/src/app
COPY Back .
RUN yarn compile

CMD ["start"]
ENTRYPOINT [ "yarn" ]