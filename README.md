## Overview

- **Game Lobby** 

방 이름을 적고 방 만들기

방목록에서 해당 방을 확인할 수 있음

인원 수, 대기중/게임 진행중 정보를 제공

플레이어 입장, 관전입장을 선택해서 게임룸 입장

인원수 2/2 이면, 플레이어 입장 버튼은 사라지고 관전 입장만 가능함.
<br/>


- **Game Logic**

방에 입장해서 흑돌/백돌 참가 선택

오목돌을 둘 수 있는 위치 표시

가장 최근에 놓은 돌에 붉은 점 표시

승리 조건
- 같은 색 돌 다섯 개를 연속으로 둔다
- 상대 타임오버
<br/>

- **Chat**

시스템 메세지  
입장, 승리, 퇴장 메세지를 시스템이 제시

플레이어 메세지  
자유롭게 채팅

관전자 모드  
채팅 제한되고, 플레이어 채팅도 관전만 가능

## Advanced Features

- Spectator-only chat mode

Spectators can only view player's chatting.

If they try to enter the chatting, the system give the messages that "관전자는 채팅에 참여할 수 없습니다.".


- Time limit

Each player must place the stone within 30 seconds.

If one player don't place the stone in 30 secs, the system will be treated as a defeat.


## NodeJS Installation

``` bash
# nvm 다운로드 및 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# close and reopen the terminal

# Node.js 다운로드 및 설치:
nvm install 24

# Node.js / npm 버전 확인:
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

## Protocol Specification
| Protocol List |
| -------------------------- |
| ROOM_LIST : {'type': 'room_list'}  |  
| CREATE_ROOM : {'type': 'room_new', 'room_name':'<string>}  |  
| JOIN_ROOM : {'type': 'room_enter', 'room_name': '<string>}  |  
| LEAVE_ROOM : { 'type': 'room_leave' }  |  
| CHANGE_ROLE : { 'type': 'player_change', 'role': 'black' | 'white'} |  
| CHAT_SEND : { 'type': 'chat_message', 'text': '<string>'}  |  
| SYSTEM_MESSAGE: { 'type': 'message', 'text': '<string>'}  |  
| PLACE_STONE : { 'type': 'player_selected', 'x': <0 ~ 14>, 'y': <0 ~ 14> }  |  
| GAME_END: { 'type': 'game_end', 'winner': 'black' | 'white' } |  
| TIMER_INIT: { 'type': 'timer_init', 'remaining': <number> }  |  
| TIMER_TICK: { 'type': 'timer_tick', 'remaining': <number> }  |  
| TIMEOUT: { 'type': 'timeout', 'loser': 'black' | 'white', 'winner': 'black' | 'white' }  |  







