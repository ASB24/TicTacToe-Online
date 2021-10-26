import { Socket } from "socket.io";

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)

app.get('/', (req : any, res : any) => {
  res.sendFile(__dirname + '/public/index.html')
});

io.on('connection', (socket : any) => {
    console.log('Socket Connected')
    socket.on('disconnect', () => {
        console.log('Socket Disconnected')
    })
});

server.listen(3000, () => {
  console.log('listening on *:3000')
});