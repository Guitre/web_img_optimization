# Dockerfile for API and Worker (multi-stage)
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Build TypeScript
RUN npm run build

# API service
FROM base AS api
CMD ["npm", "start"]

# Worker service
FROM base AS worker
CMD ["npm", "run", "start:worker"]
