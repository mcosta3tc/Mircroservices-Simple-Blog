# Specify base image
FROM node:alpine

# Set the working directory to '/app' in the container
# All following cmd === relative to this dir
WORKDIR /app

# Copy ==> /app
#  - only package.json
COPY ./package.json ./

# Install depedencies
RUN npm install

# Copy ==> /app
#  - all remaining source code (evryth else from /post dir)
COPY ./ ./

# The cmd to run when the container start up
CMD ["npm","start"]