const lines = await Deno.readTextFileSync('./input.txt').split('\n');

let depth = 0;
let aim = 0;
let horizontal = 0;

for (const line of lines) {
  if (line === '') {
    continue;
  }

  const [command, amount] = line.split(' ');
  const x = parseInt(amount, 10);

  switch(command) {
    case 'forward':
      horizontal += x;
      depth += aim * x;
      break;
    case 'down':
      aim += x;
      break;
    case 'up':
      aim -= x;
      break;
    default:
      throw new Error();
  }
}

console.log({ depth, horizontal, product: depth * horizontal });
