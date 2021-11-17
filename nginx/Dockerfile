FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY conf/default.conf /etc/nginx/conf.d/default.conf
RUN mkdir /usr/share/nginx/assets