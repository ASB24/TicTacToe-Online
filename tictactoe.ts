export class TicTacToe{
    public gameActive : boolean
    public currentPlayer : Player
    public gameState : string[]
    public players : Player[]

    constructor(players : Player[]){
        this.gameActive = true
        this.gameState = ["","","","","","","","",""]
        this.players = players
        this.currentPlayer = players[0]
    }

    getScores(){
        var scores = []
        for(const player of this.players){
            scores.push(player.score)
        }
        return scores
    }

    resetGame(){
        this.gameActive = true
        this.currentPlayer = this.players[0]
        this.gameState = ["","","","","","","","",""]
        console.log('Mesa reiniciada!')
    }

    cellPlayed(index : number){
        this.gameState[index] = this.currentPlayer.symbol
    }

    changePlayer(){
        if( this.currentPlayer.ID == this.players[0].ID ){
            this.currentPlayer = this.players[1]
        }else{
            this.currentPlayer = this.players[0]
        }
    }
}

export class Player{
    name: string
    score: number
    ID : string
    symbol : string

    constructor(id : string, name : string, score : number, symbol : string = "X"){
        this.ID = id
        this.name = name
        this.score = score
        this.symbol = symbol
    }
}