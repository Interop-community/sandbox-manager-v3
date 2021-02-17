# Builds a Docker to deliver dist/
FROM openjdk:11-jre-slim
RUN apt-get update && apt-get install -y git curl sudo
RUN curl -fsSL https://deb.nodesource.com/setup_15.x | sudo -E bash -
RUN apt-get install -y nodejs

COPY . .
RUN npm install
RUN git clone https://bitbucket.org/hspconsortium/ehr-app.git
RUN cd ehr-app && npm i

ADD reference-auth/reference-auth-server-webapp/target/hspc-reference-auth-server-webapp*.war app.war
ADD reference-auth/reference-auth-server-webapp/target/dependency/jetty-runner.jar  jetty-runner.jar
ADD reference-auth/reference-auth-server-webapp/src/main/resources/jetty.xml jetty.xml

CMD sh start.sh
