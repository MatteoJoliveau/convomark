# ===== BUILD =====

FROM node:10-alpine as builder

RUN mkdir -p /build

WORKDIR /build

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY src/ ./src
COPY tsconfig.json .

RUN yarn build

# ===== RUN =====

FROM node:10-alpine

ENV NODE_ENV production

RUN mkdir -p /app

WORKDIR /app

COPY --from=builder /build/package.json .
COPY --from=builder /build/yarn.lock .
COPY --from=builder /build/dist ./dist

RUN yarn install --prod

CMD ["yarn", "start:prod"]