FROM node:carbon
COPY src /opt/app/
WORKDIR /opt/app/
RUN npm install
ENTRYPOINT ["node","musician.js"]