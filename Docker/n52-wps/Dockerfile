FROM tomcat:8-jre8

MAINTAINER Ivan Suftin <isuftin@usgs.gov>

ARG wps_version=LATEST

ARG doi_network=false

RUN if [ "${doi_network}" = true ]; then \
		/usr/bin/wget -O /usr/lib/ssl/certs/DOIRootCA.crt http://blockpage.doi.gov/images/DOIRootCA.crt && \
		ln -sf /usr/lib/ssl/certs/DOIRootCA.crt /usr/lib/ssl/certs/`openssl x509 -hash -noout -in /usr/lib/ssl/certs/DOIRootCA.crt`.0; \
	fi

COPY tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml

COPY context.xml /usr/local/tomcat/conf/context.xml

COPY download-cch-wps.sh /download-cch-wps.sh

COPY setenv.sh /usr/local/tomcat/bin/setenv.sh

COPY wps_config.xml /wps_config.xml

RUN apt-get update && \
   apt-get install -y libxml2-utils

RUN chmod +x /download-cch-wps.sh && /download-cch-wps.sh

HEALTHCHECK --interval=15s --timeout=3s \
	CMD curl -f http://localhost:8080/wps || exit 1

# Because this container needs to wait for the database to be up, install Dockerize
# and control this container running its command based on the database server starting up.
#
# https://github.com/jwilder/dockerize
# https://github.com/mefellows/dockerize-compose-demo

ENV DOCKERIZE_VERSION "0.2.0"

RUN wget --no-check-certificate https://github.com/jwilder/dockerize/releases/download/v${DOCKERIZE_VERSION}/dockerize-linux-amd64-v${DOCKERIZE_VERSION}.tar.gz && \
	tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v${DOCKERIZE_VERSION}.tar.gz