const fish = new Array(8).fill(0);

for (const text of await Deno.readTextFileSync("./input.txt")
  .trim()
  .split(",")) {
  fish[parseInt(text, 10)]++;
}

function simulate(fish: number[], days: number) {
  for (let day = 0; day < days; day++) {
    // const sum = fish.reduce((acc, num) => acc + num, 0);
    // console.log({ day, fish, sum });
    const birthingFish = fish[0];

    for (let i = 0; i < fish.length - 1; i++) {
      fish[i] = fish[i + 1];
    }
    fish[6] += birthingFish;
    fish[8] = birthingFish;
  }
  // const sum = fish.reduce((acc, num) => acc + num, 0);
  // console.log({ fish, sum });
}

function test(fish: readonly number[], days: number) {
  console.group(days);
  console.log({ fish, days });
  const state = [...fish];
  simulate(state, days);
  const sum = state.reduce((acc, num) => acc + num, 0);
  console.log({ sum });
  console.groupEnd();
}


test(fish, 18);
test(fish, 80);
test(fish, 256);
