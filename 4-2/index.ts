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
      yield [0, 1, 2, 3, 4].map((v) => v + i * 5);
      yield [0, 5, 10, 15, 20].map((v) => v + i);
    }
  })(),
];

console.log({ conditions });

function checkWinner(drawn: Set<string>, board: string[]): boolean {
  for (const condition of conditions) {
    if (condition.every((i) => drawn.has(board[i]))) {
      // console.log({ condition });
      return true;
    }
  }
  
  return false;
}

function findLast() {
  const bSet = new Set(boards);
  const drawn = new Set<string>();
  let lastWinner: undefined | string[];
  for (const draw of draws) {
    drawn.add(draw);
    // console.log({ draw });
    for (const board of bSet) {
      if (checkWinner(drawn, board)) {
        // console.log({ board });
        lastWinner = board;
        bSet.delete(board);
        if (bSet.size === 0) {
          return [drawn, board] as const;
        }
      }
    }
  }
  if (!lastWinner) throw new Error("No winners");
  return [drawn, lastWinner] as const;
}

function calculateScore(drawn: Set<string>, board: string[]) {
  const unmarkedSum = board
    .filter((num) => !drawn.has(num))
    .reduce((acc, num) => acc + parseInt(num, 10), 0);
  console.log({ marked: board.filter((num) => drawn.has(num)).sort() });
  const lastDraw = parseInt([...drawn][drawn.size - 1], 10);
  console.log({ lastDraw, unmarkedSum });
  return lastDraw * unmarkedSum;
}


{
  const [drawn, looser] = findLast();
  const score = calculateScore(drawn, looser);

  console.log({ drawn, looser, score,  });
}

// console.log({ draws });

// console.log({ boards });
