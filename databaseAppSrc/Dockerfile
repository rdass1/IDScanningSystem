FROM mongo:latest

WORKDIR /usr/src/app

RUN openssl rand -base64 756 > key.key && chmod 400 key.key && chown 999:999 key.key

EXPOSE 27017

CMD ["mongod", "--bind_ip_all","--replSet","rs0","--keyFile","key.key"]