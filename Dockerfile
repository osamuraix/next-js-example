# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Command to start your Node.js application
CMD ["npm", "start"]
