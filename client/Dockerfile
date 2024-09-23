# Dockerfile for React.js (frontend)
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Install a lightweight web server for serving the frontend
RUN npm install -g serve

# Expose the port for serving the app
EXPOSE 3000

# Serve the React app
CMD ["serve", "-s", "build"]
