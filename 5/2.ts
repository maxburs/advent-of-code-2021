type Coordinate = { x: number; y: number };

function parseCoordinate(str: string): Coordinate {
  const parts = str.split(",");
  return { x: parseInt(parts[0], 10), y: parseInt(parts[1], 10) };
}

const lines = await Deno.readTextFileSync("./input.txt")
  .split(/\n/)
  .filter(Boolean)
  .map((line) => {
    const parts = line.split("->");
    console.log({ parts });
    return [parseCoordinate(parts[0]), parseCoordinate(parts[1])] as const;
  });

const width =
  Math.max(
    ...(function* () {
      for (const line of lines) {
        yield line[0].x;
        yield line[1].x;
      }
    })()
  ) + 1;

const height =
  Math.max(
    ...(function* () {
      for (const line of lines) {
        yield line[0].y;
        yield line[1].y;
      }
    })()
  ) + 1;

console.log({ width, height });

const board = new Array(width * height).fill(0);

function increment(coordinate: Coordinate) {
  board[coordinate.x + coordinate.y * width]++;
}

for (let i = 0; i < lines.length; i++) {
  const [start, end] = lines[i];
  // console.group(i);
  // console.log([start, end]);
  
  const changeX = start.x === end.x ? 0 : start.x < end.x ? 1 : -1;
  const changeY = start.y === end.y ? 0 : start.y < end.y ? 1 : -1;

  // console.log({ changeX, changeY })
  
  const location = { ...start };

  while (location.x !== end.x || location.y !== end.y) {
    increment(location);
    location.x += changeX;
    location.y += changeY;
  }
  increment(location);
  // print();
  // console.groupEnd();
}

function print() {
  for (let row = 0; row < board.length; row += width) {
    console.log(
      board
        .slice(row, row + width)
        .map((count) => (count === 0 ? "." : count))
        .join("")
    );
  }
}

print();
// console.log(board);

const count = board.reduce((acc, cell) => (cell < 2 ? acc : acc + 1), 0);
console.log(count);
