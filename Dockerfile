FROM ubuntu:trusty

ENV DEBIAN_FRONTEND=noninteractive
ARG BUILD_ENVIRONMENT=production

#Install dependecies
RUN  apt-get update
RUN  apt-get -y install curl

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs git
RUN npm install -g bower
RUN npm install -g gulp
RUN npm install -g grunt-cli

ADD package.json /srv/http/widgets/package.json
RUN cd /srv/http/widgets && npm install

ADD bower.json /srv/http/widgets/bower.json
RUN cd /srv/http/widgets && bower install --allow-root

ADD . /srv/http/widgets
RUN cd /srv/http/widgets && gulp --env="$BUILD_ENVIRONMENT" build

VOLUME  ["/srv/http/widgets"]
CMD ["/usr/bin/tail", "-f", "/dev/null"]
