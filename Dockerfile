# Stage 1: Build
FROM node:lts-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install pnpm -g && pnpm install --registry=https://registry.npm.taobao.org

RUN pnpm build

# Stage 2: Containize
FROM nginx:1.24.0-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
