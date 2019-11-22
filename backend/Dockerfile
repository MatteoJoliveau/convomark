# Check out https://hub.docker.com/_/node to select a new base image
FROM node:12-alpine

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Install app dependencies
COPY --chown=node package.json yarn.lock ./

RUN yarn install

# Bundle app source code
COPY --chown=node . .

RUN yarn build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3000 NODE_ENV=production

EXPOSE ${PORT}
CMD [ "node", "." ]
