FROM 745222113226.dkr.ecr.us-east-1.amazonaws.com/interop/sandbox-manager-prototype:al2023
COPY xsettings.json /usr/share/nginx/html/data/xsettings.json
ADD --chmod=755 https://raw.githubusercontent.com/Interop-community/meld/main/community-contents/logo.png  /usr/share/nginx/html/img/
RUN mv -f /usr/share/nginx/html/img/logo.png "/usr/share/nginx/html/img/Meld Logo.FINAL-14.png"
CMD ["/bin/sh", "-c" , "/sbin/nginx -g 'daemon off;'"]