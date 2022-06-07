FROM mongo:latest

WORKDIR .

RUN openssl rand -base64 756 > key.key && chmod 400 key.key && chown 999:999 key.key

COPY setup.js ./docker-entrypoint-initdb.d/ 

COPY setup .
RUN chmod +x setup



CMD ["-replSet","rs0","-keyFile","key.key"]
