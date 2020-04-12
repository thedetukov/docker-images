ARG ARCH=amd64
ARG IMAGE=node:12-alpine

FROM --platform=${ARCH} ${IMAGE} AS Builder
WORKDIR /build
COPY bin ./usr/local/sqlmigration/bin
COPY .npmrc ./usr/local/sqlmigration/
COPY log4js.json ./etc/sqlmigration/
COPY package.json ./usr/local/sqlmigration/
COPY package-lock.json ./usr/local/sqlmigration/
RUN cd ./usr/local/sqlmigration/ && npm install --no-progress --production && rm .npmrc
COPY README.md ./usr/local/sqlmigration/
COPY docker/docker-entrypoint.sh ./usr/local/bin/docker-entrypoint.sh

FROM --platform=${ARCH} ${IMAGE}
COPY --from=Builder /build /
WORKDIR /usr/local/sqlmigration
ENV POSTGRES_URL=
ENV TARGET_VERSION=
VOLUME /etc/sqlmigration/secrets /run/secrets /var/local/sqlmigration
USER node
ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]
CMD [ "banner" ]
