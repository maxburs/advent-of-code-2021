export default null;

async function readCrabs(path: string) {
  return (await Deno.readTextFileSync(path))
    .split(/\n/)[0]
    .split(",")
    .map((str) => parseInt(str, 10))
    .sort();
}

function factorialize(num: number) {
  let sum = 0;
  for (let i = 1; i <= num; i++) {
    sum += i;
  }
  return sum;
}

// const average = Math.round(crabs.reduce((acc, num) => acc + num, 0) / crabs.length);
function findMiddle(crabs: number[]) {
  return crabs[Math.floor(crabs.length / 2)];
}

function findCost(crabs: number[], position: number): number {
  let totalCost = 0;

  for (const crab of crabs) {
    totalCost +=  factorialize(Math.abs(crab - position));
  }

  return totalCost;
}

async function fastCrab(path: string) {
  const crabs = await readCrabs(path)
  const middle = findMiddle(crabs);

  const totalCost = findCost(crabs, middle);

  console.log({ middle, totalCost });
}

async function slowCrab(path: string) {
  const crabs = await readCrabs(path);

  const results = new Map<number, number>();
  let min = Infinity;
  let pos = -1;

  for (let i = 0; i < crabs.length; i++) {
    const cost = findCost(crabs, i);
    results.set(i, cost);
    if (min > cost) {
      min = cost;
      pos = i;
    }
  }

  console.log({ results, min, pos });
}

async function main() {
  await slowCrab('./input.txt');
}

main();

