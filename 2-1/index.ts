const lines = await Deno.readTextFileSync('./input.txt').split('\n');

let depth = 0;
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
      break;
    case 'down':
      depth += x;
      break;
    case 'up':
      depth -= x;
      break;
    default:
      throw new Error();
  }
}

console.log({ depth, horizontal, product: depth * horizontal });
