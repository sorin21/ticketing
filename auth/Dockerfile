
FROM node:16-alpine

# ENV CI=true

# Working directory, where the app will sit
WORKDIR /app

# Copy over only package.json file
COPY ./package.json ./

# Install dependencies
# --omit=dev is to not install mongodb-memory-server everytime, because is very big
# so we don't want to wait forever to build a image
RUN npm install --omit=dev
# RUN npm install

# Copying build files
# we are copying everything from our current working directory into the container
COPY ./ ./ 

# Set to command to run when the container starts up
CMD ["npm", "start"]