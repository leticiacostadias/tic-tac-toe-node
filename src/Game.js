const input = require("./lib/input");
const gameStatus = require("./constants/game-status");
const cellStatus = require("./constants/cell-state");
const players = require("./constants/players");
const getBoardWinner = require("./lib/get-board-winner");

class Game {
  constructor() {
    this.board = [
      Array(3).fill(cellStatus.empty),
      Array(3).fill(cellStatus.empty),
      Array(3).fill(cellStatus.empty),
    ];
    this.turn = 0;
    this.gameStatus = gameStatus.running;
    this.players = [];
  }

  _boardToString() {
    let result = "|";

    result += this.board
      .map((l) => l.join("|").replace(new RegExp(cellStatus.empty, "g"), " "))
      .join("|\n|");
    result += "|";
    result.replace(",", "|");

    return result;
  }

  _getTurn() {
    if (this.turn > 0) input.clear();

    console.log("The board now:");
    console.log(this._boardToString());

    input.question(
      "Where do you want to place your mark?\neg:2,1\n",
      (markPosition) => {
        if (!/[1-9],[1-9]/.test(markPosition)) {
          console.log("Ouch! That't not a valid mark position. Try again!");
          this._getTurn();
          return;
        }

        const [markPositionX, markPositionY] = markPosition.split(",");
        const playerOfTheTurn = this.players[this.turn % this.players.length];

        if (
          this.board[markPositionY - 1][markPositionX - 1] !== cellStatus.empty
        ) {
          console.log("Ooops! That cell is already marked! Pick another one.");
          this._getTurn();
          return;
        }

        this.board[markPositionY - 1][markPositionX - 1] = playerOfTheTurn;

        const winner = getBoardWinner(this.board);
        const flattenBoard = this.board.flat();

        if (winner) {
          if (this.turn > 0) input.clear();
          console.log(`${winner} IS THE WINNER!`);
          console.log(this._boardToString());
          return;
        }

        if (!flattenBoard.some((c) => c === cellStatus.empty)) {
          if (this.turn > 0) input.clear();
          console.log("Oh no! Looks like is a draw!");
          console.log(this._boardToString());
          return;
        }

        this.turn++;
        this._getTurn();
      }
    );
  }

  _getPlayers() {
    input.question("Are you playing with X or O? ", (playerOne) => {
      console.log("You choose", playerOne);
      const parsedPlayerOne = playerOne.toUpperCase();
      const isNotAPlayer = !players.find((p) => p === parsedPlayerOne);

      if (isNotAPlayer) {
        console.log("Oh no! That is neither X or O! Pick again");
        this._getPlayers();
        return;
      }

      this.players = this.players.concat([
        parsedPlayerOne,
        ...players.filter((p) => p !== parsedPlayerOne),
      ]);

      input.clear();

      console.log("\n\nNow!");
      console.log("Let");
      console.log("the");
      console.log("game");
      console.log("begins!");

      this._getTurn();
    });
  }

  start() {
    console.log("welcome!");

    this._getPlayers();
  }
}

const game = new Game();

module.exports = game;
