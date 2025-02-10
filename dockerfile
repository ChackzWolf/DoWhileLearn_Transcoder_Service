# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies with retry and network timeout settings
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set fetch-retries 5 \
    && npm install --ignore-scripts

# Copy source code and Proto files
COPY src ./src
COPY src/Protos ./src/Protos

# Run TypeScript compilation
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine
RUN apk add --no-cache ffmpeg

WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=5010

# Install production dependencies with retry settings
COPY package*.json ./
RUN npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm config set fetch-retries 5 \
    && npm install --omit=dev --ignore-scripts

# Copy compiled code and protos from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/src/Protos ./dist/Protos

# Set proper permissions
RUN chown -R node:node /usr/src/app
USER node

# Expose gRPC port
EXPOSE ${PORT}

CMD ["node", "dist/server.js"]