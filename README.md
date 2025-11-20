## Overview



## Advanced Features

- Spectator-only chat mode

Spectators can only view player's chatting.

If they try to enter the chatting, the system give the messages that "관전자는 채팅에 참여할 수 없습니다."


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







