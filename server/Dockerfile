# Dockerfile for Express.js (backend)
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port that the server will run on
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
