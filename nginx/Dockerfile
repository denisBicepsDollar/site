FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /etc/letsencrypt/live/zelenyeusy.ru && \
    touch /etc/letsencrypt/live/zelenyeusy.ru/privkey.pm \
          /etc/letsencrypt/live/zelenyeusy.ru/fullchain.pm \
          /etc/nginx/.htpassword \

RUN nginx -t