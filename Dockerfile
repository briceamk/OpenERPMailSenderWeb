# Use official node image as the base image
FROM node:20.10-alpine as angular

ADD ./package*.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/local/app && cp -a /tmp/node_modules /usr/local/app/

WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Generate the build of the application
RUN npm run build

# Stage 2: Serve app with nginx server
# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=angular /usr/local/app/dist/openerpemailsender-web/browser /usr/share/nginx/html


# This line is IMPORTANT, we will breakdown it on a minute.
COPY ./entrypoint.sh /usr/local/app/entrypoint.sh

COPY ./nginx.conf  /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 443 6006 4200

RUN chmod +x /usr/local/app/entrypoint.sh
ENTRYPOINT [ "/usr/local/app/entrypoint.sh" ]
