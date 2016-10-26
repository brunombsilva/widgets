FROM ubuntu:trusty
ENV DEBIAN_FRONTEND noninteractive

#Install dependecies
RUN  apt-get update
RUN  apt-get -y install curl

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs git tail
RUN npm install -g bower
RUN npm install -g gulp

ADD . /app

RUN cd /app && npm install
RUN cd /app && bower install --allow-root

RUN cd /app && gulp build

VOLUME  ["/app"]
CMD ["tail" "-f" "/var/log/syslog"]
