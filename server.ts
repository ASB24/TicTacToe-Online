import { Socket } from "socket.io"
import { isShorthandPropertyAssignment } from "typescript"

const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

//Juego en si
import tictactoe = require('./tictactoe')
var players = [
  new tictactoe.Player("","", 0),
  new tictactoe.Player("","", 0)
]
var game : tictactoe.TicTacToe = new tictactoe.TicTacToe(players)

function startGame(){
  game = new tictactoe.TicTacToe(players);
}

function checkWin(){
  var winConditions : string[] = [ 
    game.gameState[0]+game.gameState[1]+game.gameState[2],
    game.gameState[3]+game.gameState[4]+game.gameState[5],
    game.gameState[6]+game.gameState[7]+game.gameState[8],

    game.gameState[0]+game.gameState[3]+game.gameState[6],
    game.gameState[1]+game.gameState[4]+game.gameState[7],
    game.gameState[2]+game.gameState[5]+game.gameState[8],

    game.gameState[0]+game.gameState[4]+game.gameState[8],
    game.gameState[6]+game.gameState[4]+game.gameState[2],
   ]
   for(var i=0; i<winConditions.length; i++){
     if(winConditions[i] == "XXX" || winConditions[i] == "OOO"){
        console.log("Se supone que pase")
        return true
     }
   }
   
   return false
   
}

function cpuRandPlay(){
  var slot = 10000
  while( slot < 0 || slot > 9 || game.gameState[slot] == "O" || game.gameState[slot] == "X" ){
    slot = Math.floor(Math.random() * 9)
  }
  game.gameState[slot] = "O"
  return slot
}

//Servidor
app.use(express.static(__dirname + '/public'))

app.get('/', (req : any, res : any) => {
  
});

io.sockets.on('connection', (socket : any) => {
    console.log('Socket ' + socket.id + ' Connected')
    socket.on('disconnect', () => {
        console.log('Socket Disconnected')
    })

    socket.on('createRoom', (roomID : string, name : string) => {
        if(io.sockets.adapter.rooms[roomID] == null){
          socket.join(roomID)
          console.log('Socket: ' + socket.id + ' into room: ' + roomID)
          players[0] = new tictactoe.Player(socket.id, name, 0)
        }
    });

    socket.on('joinRoom', (roomID : string, name : string) => {
      var room = io.sockets.adapter.rooms.get(roomID)
      if(room != null && room.size == 1){
        socket.join(roomID)
        console.log('Socket: ' + socket.id + ' joined room: ' + roomID)
        players[1] = new tictactoe.Player(socket.id, name, 0, "O")
        if(room.size == 2){
          startGame()
          socket.to(players[0].ID).emit('startGame', {names : [players[0].name, players[1].name], scores : [players[0].score, players[1].score]})
          socket.to(players[1].ID).emit('startGame', {names : [players[0].name, players[1].name], scores : [players[0].score, players[1].score]})
        }
      }else{
        console.log('Invalid or ' + roomID + ' Room...');
      }
    });

    socket.on('soloPlayer', () => {
      players[0] = new tictactoe.Player(socket.id, "Tu", 0, "X")
      players[1] = new tictactoe.Player("cpu", "CPU", 0, "O")
      startGame()
      socket.emit('startGame', {names : [players[0].name, players[1].name], scores : [players[0].score, players[1].score]})
    });

    socket.on('getBoard', (callback : any) => {
        callback({
          board : game.gameState
        });
    });

    socket.on('slotClicked', (value : number) => {
      var results = {
        allowed : false,
        character : ""
      }
      if(game.gameState[value] == "") results.allowed = true
      else results.allowed = false

      if( game.currentPlayer.ID == socket.id ){
        results.allowed = true
        results.character = game.currentPlayer.symbol
        game.gameState[value] = game.currentPlayer.symbol
        if(checkWin()){
          console.log("Hay un ganador")
          if(game.currentPlayer.ID == game.players[0].ID){
            game.players[0].score += 1
            socket.to(game.players[0].ID).emit('won')
            socket.to(game.players[1].ID).emit('lost')
          }else{
            game.players[1].score += 1
            socket.to(game.players[1].ID).emit('won')
            socket.to(game.players[0].ID).emit('lost')
          }
          game.resetGame()
          console.log("Juego reiniciado, prueba: " + game.gameState[4])
          socket.emit('startGame', {names : [players[0].name, players[1].name], scores : [players[0].score, players[1].score]})
        }else{
          if(game.players[1].ID == "cpu"){
            socket.emit('cpuPlay', cpuRandPlay())
          }else{
            game.changePlayer()
          }
        }
      }
      else results.allowed = false

      socket.emit('clickResponse', value, results)
    });

});

server.listen(3000, () => {
  console.log('listening on *:3000')
});
