## nvm 다운로드 및 설치:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

* close and reopen the terminal

## Node.js 다운로드 및 설치:
nvm install 24

## Node.js / npm 버전 확인:
node -v
nvm current 
npm -v

## dependencies 설치
npm install --save-dev @babel/core @babel/cli @babel/node @babel/preset-env @babel/preset-react nodemon

npm install --save express react react-dom socket.io

## 실행
npm install pm2 -g

pm2 start src/server.js

pm2 ls

pm2 logs

pm2 restart server

pm2 stop server


OR


npm run dev