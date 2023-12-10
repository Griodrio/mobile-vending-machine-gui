FROM node:16.15.0

RUN apt update && \
    apt install -y --force-yes vim

WORKDIR /home/user/
COPY package.json ./package.json
# COPY package-lock.json ./package-lock.json
# RUN npm install -g npm@8.19.2
RUN npm install

RUN npx playwright install

COPY . .

EXPOSE 3000

RUN npm run build

CMD npm run start