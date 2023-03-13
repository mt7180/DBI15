// Node-Server serverseitig starten mit: node app.js
const express = require('express')
const WebSocketServer = require('ws').Server;
const {  WebSocket } = require('ws')
const app = express()

const MESSAGE_TYPES = {
   TIME: 0,
   GLOBAL_COUNTER: 1,
};
var globalCounter = 0;

const WSS_PORT = 8080;
const wss = new WebSocketServer({port:WSS_PORT, clientTracking: true});
console.log(`log: WSS horcht auf http://127.0.0.1:${WSS_PORT}`);

wss.on('connection', function(ws) {
  console.log("client connected...");
  broadcastGlobalCounter(ws);

    ws.on('message', (message) => {
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.type) {
          case MESSAGE_TYPES.TIME:
            handleTimeButtonClick(ws);
            break;
          case MESSAGE_TYPES.GLOBAL_COUNTER:
            handleIncrementCounter(ws);
            break;
          default:
            console.error(`Unrecognized message type 1: ${parsedMessage.type}`);
        }
    });

    ws.on('close', () => {
        
    });
});

function broadcastGlobalCounter(ws){
    if(ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: MESSAGE_TYPES.GLOBAL_COUNTER,
            data: globalCounter
        }))
    }

}

function handleTimeButtonClick(ws){
    let timestamp = new Date();
    let message = 
    timestamp.getHours()
    + ':'
    + timestamp.getMinutes()
    + ':'
    + timestamp.getSeconds();
    
    const response = {
        type: MESSAGE_TYPES.TIME,
        data: message
    };
    ws.send(JSON.stringify(response));
}

function handleIncrementCounter(){
    globalCounter++;
    for(const client of wss.clients) {
        if(client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: MESSAGE_TYPES.GLOBAL_COUNTER,
                data: globalCounter
            }))
        }
    }
}

app.use(express.static('public'))

const port = 80;
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})