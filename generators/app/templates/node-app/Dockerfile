
# Docker file to create an image for NodeJS application.
FROM node:latest

# Install dependencies.
WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm cache clean --force && npm install

# Copy app source to image _after_ npm install so that
# application code changes don't bust the docker cache of npm install step.
COPY . /opt/app

# Expose any ports.
ENV PORT 3000
EXPOSE 3000

# Ru the app.
CMD ["npm", "start"]
