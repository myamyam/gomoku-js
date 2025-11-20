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

## Protocol Specification
\begin{table}[h!]
\centering
\caption{Socket Protocol Specification for Gomoku}
\begin{tabular}{|p{3.2cm}|p{4.5cm}|p{6.5cm}|}
\hline
\textbf{Event Name} & \textbf{Direction} & \textbf{Payload Format} \\
\hline

ROOM\_LIST\_REQUEST &
Client → Server &
\texttt{\{'type': 'room\_list'\}} \\
\hline

ROOM\_LIST\_RESPONSE &
Server → Client &
\texttt{\{'type': 'room\_list', 'rooms': [...]\}} \\
\hline

CREATE\_ROOM &
Client → Server &
\texttt{\{'type': 'room\_new', 'room\_name': <string>\}} \\
\hline

JOIN\_ROOM\_SUCCESS &
Server → Client &
\texttt{\{'type': 'room\_enter', 'room': \{...\}\}} \\
\hline

JOIN\_ROOM &
Client → Server &
\texttt{\{'type': 'room\_enter', 'room\_name': <string>\}} \\
\hline

LEAVE\_ROOM &
Client → Server &
\texttt{\{'type': 'room\_leave'\}} \\
\hline

CHAT\_SEND &
Client → Server &
\texttt{\{'type': 'chat\_message', 'text': <string>\}} \\
\hline

CHAT\_BROADCAST &
Server → Clients &
\texttt{\{'type': 'chat\_message', 'sender': <id>, 'text': <string>, 'timestamp': <number>\}} \\
\hline

CHANGE\_ROLE &
Client → Server &
\texttt{\{'type': 'player\_change', 'role': ('black' | 'white' | 'spectator')\}} \\
\hline

ROLE\_UPDATE &
Server → Client &
\texttt{\{'type': 'player\_change', 'black': <id>, 'white': <id>\}} \\
\hline

PLACE\_STONE &
Client → Server &
\texttt{\{'type': 'player\_selected', 'x': <0--14>, 'y': <0--14>\}} \\
\hline

STONE\_PLACED &
Server → Clients &
\texttt{\{'type': 'player\_selected', 'x': <number>, 'y': <number>\}} \\
\hline

GAME\_END &
Server → Clients &
\texttt{\{'type': 'game\_end', 'winner': ('black' | 'white')\}} \\
\hline

TIMER\_INIT &
Server → Clients &
\texttt{\{'type': 'timer\_init', 'remaining': <number>\}} \\
\hline

TIMER\_TICK &
Server → Clients &
\texttt{\{'type': 'timer\_tick', 'remaining': <number>\}} \\
\hline

TIMEOUT &
Server → Clients &
\texttt{\{'type': 'timeout', 'loser': <color>, 'winner': <color>\}} \\
\hline

SYSTEM\_MESSAGE &
Server → Clients &
\texttt{\{'type': 'message', 'text': <string>\}} \\
\hline

ERROR &
Server → Client &
\texttt{\{'type': 'error', 'message': <string>\}} \\
\hline

\end{tabular}
\end{table}


ROOM_LIST : {'type': 'room_list'}

CREATE_ROOM : {'type': 'room_new', 'room_name': '<string>}

JOIN_ROOM : {'type': 'room_enter', 'room_name': '<string>}

LEAVE_ROOM : { 'type': 'room_leave' }

CHANGE_ROLE : {
  'type': 'player_change',
  'role': 'black' | 'white'
}

CHAT_SEND : {
  'type': 'chat_message',
  'text': '<string>'
}

SYSTEM_MESSAGE: {
  'type': 'message',
  'text': '<string>'
}

PLACE_STONE : {
  'type': 'player_selected',
  'x': <0~14>,
  'y': <0~14>
}

GAME_END: {
  'type': 'game_end',
  'winner': 'black' | 'white'
}

TIMER_INIT: {
  'type': 'timer_init',
  'remaining': <number>
}

TIMER_TICK: {
  'type': 'timer_tick',
  'remaining': <number>
}

TIMEOUT: {
  'type': 'timeout',
  'loser': 'black' | 'white',
  'winner': 'black' | 'white'
}

