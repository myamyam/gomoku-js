## NodeJS Installation

``` bash
# nvm 다운로드 및 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# close and reopen the terminal

# Node.js 다운로드 및 설치:
nvm install 24

## Node.js / npm 버전 확인:
node -v
nvm current 
npm -v
```

## Dependencies Installation

``` bash
npm install --save-dev @babel/core @babel/cli @babel/node @babel/preset-env @babel/preset-react nodemon

npm install --save express react react-dom socket.io
```

## Run server
``` bash
npm run dev
```