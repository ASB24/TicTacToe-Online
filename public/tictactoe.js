"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.TicTacToe = void 0;
class TicTacToe {
    constructor(players) {
        this.gameActive = true;
        this.gameState = ["", "", "", "", "", "", "", "", ""];
        this.players = players;
        this.currentPlayer = players[0];
    }
    getScores() {
        var scores = [];
        for (const player of this.players) {
            scores.push(player.score);
        }
        return scores;
    }
    resetGame() {
        this.gameActive = true;
        this.currentPlayer = this.players[0];
        this.gameState = ["", "", "", "", "", "", "", "", ""];
        console.log('Mesa reiniciada!');
    }
    cellPlayed(index) {
        this.gameState[index] = this.currentPlayer.symbol;
    }
    changePlayer() {
        if (this.currentPlayer.ID == this.players[0].ID) {
            this.currentPlayer = this.players[1];
        }
        else {
            this.currentPlayer = this.players[0];
        }
    }
}
exports.TicTacToe = TicTacToe;
class Player {
    constructor(id, name, score, symbol = "X") {
        this.ID = id;
        this.name = name;
        this.score = score;
        this.symbol = symbol;
    }
}
exports.Player = Player;
