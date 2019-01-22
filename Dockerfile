FROM node:alpine
WORKDIR /usr/src/app
COPY . .
RUN cd Front && yarn && yarn build
RUN cd Back && yarn && yarn compile

WORKDIR /usr/src/app/Back
CMD ["yarn", "start"]
ENTRYPOINT [ "yarn" ]