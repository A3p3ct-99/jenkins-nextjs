#-------------------------------------------
# Base image
FROM node:20-bullseye-slim AS base
WORKDIR /usr/src/app

#-------------------------------------------
# Dependencies
FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

#-------------------------------------------
# Build stage
FROM base AS build
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# Build the application
RUN yarn build

#-------------------------------------------
# Production stage
FROM node:20-bullseye-slim AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy the built application
COPY --from=build /usr/src/app/.next/standalone ./
COPY --from=build /usr/src/app/.next/static ./.next/static
COPY --from=build /usr/src/app/public ./public

# Create a non-root user
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs nextjs && \
    chown -R nextjs:nodejs /usr/src/app

# Set runtime environment variable placeholders
# These will be replaced by actual values from Kubernetes
ENV NEXT_PUBLIC_API_URL=http://spring-service:8080/api/v1

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]