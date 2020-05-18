const cellState = require("../constants/cell-state");
const players = require("../constants/players");

function getBoardWinner(board) {
  const maxLength = board.length - 1;
  const center = Math.floor(board.length / 2);

  const parsedColumns = board.reduce((columns, line) => {
    line.forEach((cell, positionX) => {
      columns[positionX] = [...(columns[positionX] || []), cell];
    });

    return columns;
  }, []);

  function getDiagonals() {
    const centerCell = board[center][center];

    if (centerCell === cellState.empty) return [];

    const diagonals = {
      topLeftToBottomRight: [centerCell],
      topRightToBottomLeft: [centerCell],
    };

    for (let i = 0; i < maxLength; i++) {
      if (i === center && maxLength - 1 === center) continue;

      diagonals.topLeftToBottomRight.push(
        board[i][i],
        board[maxLength - i][maxLength - i]
      );
      diagonals.topRightToBottomLeft.push(
        board[i][maxLength - i],
        board[maxLength - i][i]
      );
    }

    return Object.values(diagonals) || [];
  }

  const allBoardLines = [...board, ...parsedColumns, ...getDiagonals()];
  let winner;

  // horizontal, vertical and diagonals
  for (const line of allBoardLines) {
    players.forEach((player) => {
      if (line.every((cell) => cell === player)) {
        winner = player;
      }
    });
  }

  return winner;
}

module.exports = getBoardWinner;
