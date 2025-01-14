FROM public.ecr.aws/amazonlinux/amazonlinux:2023
RUN dnf install nginx jq -y 

COPY ./docker/includes/nginx/config /etc/nginx
COPY ./projects/sandbox-manager/build/www /usr/share/nginx/html/
COPY ./xsettings/* /usr/share/nginx/html/data/
WORKDIR /usr/share/nginx/html/data
RUN chmod +x xsettings.sh

EXPOSE 3000

CMD ["/bin/sh", "-c" , "./xsettings.sh && /sbin/nginx -g 'daemon off;'"] 


