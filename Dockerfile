
# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and yarn.lock to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the NestJS application for production
# The output will be in dist/apps/ryuzuya-chats
RUN yarn build:api

# Stage 2: Run the application
FROM node:20-alpine AS production

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/dist/apps/ryuzuya-chats ./dist/apps/ryuzuya-chats
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the application runs on
EXPOSE 3034

# Command to run the application
CMD ["node", "dist/apps/ryuzuya-chats/main.js"]
