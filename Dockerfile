# Stage 1: Build the Angular application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY project-settings-app/package*.json ./

# Install dependencies (leverage lockfile for reproducible builds)
RUN npm ci

# Copy the rest of the application files
COPY project-settings-app/ ./

# Build the production application (produces both browser and server bundles)
RUN npm run build

# Stage 2: Run the application using Node.js SSR
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Copy the build artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Use non-root node user for container security compliance
USER node

# Expose the server port
EXPOSE 4000

# Run the Node Express server for Angular SSR
CMD ["node", "dist/project-settings-app/server/server.mjs"]
