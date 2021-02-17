npm run sm &
cd ehr-app
npm run start &
cd ..
java -Djava.security.egd=file:/dev/./urandom -jar jetty-runner.jar --config jetty.xml app.war
