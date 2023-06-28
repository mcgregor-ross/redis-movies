# Stage 1 - Build
FROM --platform=linux/amd64 node:17-alpine AS builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["npm", "start"]

## Stage 2 - Nginx
FROM --platform=linux/amd64 registry.access.redhat.com/ubi9/nginx-122
COPY --from=builder /app/build .
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]
