# Builds a Docker to deliver dist/
FROM sameersbn/nginx:1.10.3

COPY ./docker/includes/nginx/config /etc/nginx
COPY ./projects/sandbox-manager/build/www /usr/share/nginx/html/
RUN apt-get update && apt-get install -y jq
COPY ./xsettings/* /usr/share/nginx/html/data/
WORKDIR /usr/share/nginx/html/data
RUN chmod +x xsettings.sh
RUN sed -i '2i /usr/share/nginx/html/data/xsettings.sh' /sbin/entrypoint.sh
#FROM node:alpine
#COPY . .
#ENV TARGET_ENV="test"
#RUN npm install
#CMD [ "npm", "run", "sm" ]
