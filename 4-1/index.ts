const input = (await Deno.readTextFileSync("./input.txt"))
  .split(/\n/)
  [Symbol.iterator]();

const draws = input.next().value.split(",");

function readBoards(): string[][] {
  const boards: string[][] = [];
  let board: null | string[] = [];
  for (const value of input) {
    if (value === "") {
      board = null;
    } else {
      if (!board) {
        board = [];
        boards.push(board);
      }
      for (let i = 0; i < value.length; i += 3) {
        board.push(value.slice(i, i + 2).trim());
      }
    }
  }
  return boards;
}

const boards = readBoards();

const conditions = [
  ...(function* () {
    for (let i = 0; i < 5; i++) {
      yield [0, 1, 2, 3, 4].map((v) => v + i);
      yield [0, 5, 10, 15, 20].map((v) => v + i);
    }
  })(),
];

function checkWinner(drawn: Set<string>): null | string[] {
  for (const board of boards) {
    for (const condition of conditions) {
      if (condition.every((i) => drawn.has(board[i]))) {
        console.log({ condition, value: condition.map(i => board[i]) })
        return board;
      }
    }
  }

  return null;
}

let winner: null | string[] = null;
const drawn = new Set<string>();
for (const draw of draws) {
  console.log({ draw })
  drawn.add(draw);
  winner = checkWinner(drawn);
  if (winner) {
    break;
  }
}

function calculateScore(drawn: Set<string>, board: string[]) {
  const unmarkedSum = board
  .filter((num) => !drawn.has(num))
  .reduce((acc, num) => acc + parseInt(num, 10), 0);
  const lastDraw = parseInt([...drawn][drawn.size - 1], 10);
  // console.log({ lastDraw, unmarkedSum, drawn })
  // console.log({ wut: [...drawn]})
  return lastDraw * unmarkedSum;
}

console.log({ winner });
if (winner) console.log({ score: calculateScore(drawn, winner) });

// console.log({ draws });

// console.log({ boards });
