FROM node:12.16.1-slim

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# copy the app, note .dockerignore
COPY . /usr/src/nuxt-app/
RUN yarn install


ARG API_BASE_URL
ARG API_BROWSER_URL
ARG WS_URL

ENV API_BASE_URL=$API_BASE_URL
ENV API_BROWSER_URL=$API_BROWSER_URL
ENV WS_URL=$WS_URL

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0

# set app port
ENV NUXT_PORT=3000

EXPOSE $NUXT_PORT

# build necessary, even if no static files are needed,
# since it builds the server as well
RUN yarn build

EXPOSE 3000
# start the app
CMD [ "yarn", "start" ]