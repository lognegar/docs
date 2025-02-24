FROM focker.ir/node:22.14-alpine3.21 AS deps
WORKDIR /app

# Copy only the files needed to install dependencies
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with the preferred package manager
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

FROM focker.ir/node:22.14-alpine3.21 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the files
COPY . .

# Set NODE_ENV environment variable
ENV NODE_ENV = production

RUN npm run build

FROM focker.ir/node:22.14-alpine3.21 AS runner
WORKDIR /app

# Copy the bundled code from the builder stage
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Use the node user from the image
USER node

EXPOSE 3000

# Start the server
CMD ["node", "dist/main.js"]