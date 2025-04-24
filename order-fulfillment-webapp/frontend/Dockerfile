FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Explicitly install esbuild binary
RUN npm install esbuild@latest --save-dev

# Copy the rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Use a lightweight web server to serve the built files
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose the frontend port
EXPOSE 80