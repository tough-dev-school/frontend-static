FROM node:16.14.2-alpine3.15

RUN apk add wget dumb-init

WORKDIR /
ADD package.json package-lock.json /
RUN npm ci

ADD index.js /

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
HEALTHCHECK CMD wget -q -O /dev/null http://localhost:3000 || exit 1
CMD ["node", "/index.js"]
