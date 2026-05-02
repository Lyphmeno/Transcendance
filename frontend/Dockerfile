FROM node:bullseye-slim

COPY ./files /transcendence/frontend

WORKDIR /transcendence/frontend

RUN npm install &&  \
    npm install process

ENTRYPOINT [ "npm", "run", "dev" ]
