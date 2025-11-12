# Windows
# Node.js Docker 이미지를 풀(Pull)하세요:
docker pull node:24-alpine
# Node.js 컨테이너를 생성하고 쉘 세션을 시작하세요:
docker run -it --rm --entrypoint sh node:24-alpine
# Verify the Node.js version:
node -v # Should print "v24.11.1".
npm 버전 확인:
npm -v # 11.6.2가 출력되어야 합니다.

# MAC OS
# nvm 다운로드 및 설치:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

close and reopen the terminal

# Node.js 다운로드 및 설치:
nvm install 24

# Node.js 버전 확인:
node -v # "v24.11.1"가 출력되어야 합니다.

nvm current # "v24.11.1"가 출력되어야 합니다.

npm 버전 확인:
npm -v # 11.6.2가 출력되어야 합니다.