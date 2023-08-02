FROM node:lts-alpine as backend

RUN npm install pnpm -g

RUN pnpm add openai

WORKDIR /app

COPY . /app

RUN pnpm install && pnpm build

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "node", "healthcheck.js" ]

EXPOSE 3002

CMD [ "pnpm","prod" ]

