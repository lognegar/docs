# Use an official Node.js runtime as a base image
FROM node:22.13-alpine

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only package.json and pnpm-lock.yaml for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

ENV NODE_ENV=production

RUN pnpm build

# Start the application
CMD ["node", "dist/app.js"]
