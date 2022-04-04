export default null;

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// const lights: Record<Digit, number> = [6, 2, 5, 5, 4, 5, 6, 3, 7, 6];

const lights = [
  "abcefg",
  "cf",
  "acdeg",
  "acdfg",
  "bcdf",
  "abdfg",
  "abdefg",
  "acf",
  "abcdefg",
  "abcdfg",
].map((str) => new Set(str) as SignalPattern);

type Connections = Map<Segment, Segment>;

type Segment = "a" | "b" | "c" | "d" | "e" | "f" | "g";
// type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type SignalPattern = Set<Segment>;

// type Patterns = Record<Digit, SignalPattern>;

interface Entry {
  /** length === 10 */
  patterns: SignalPattern[];
  /** length === 4 */
  output: SignalPattern[];
}

function parsePattern(text: string): SignalPattern {
  return new Set(text) as SignalPattern;
}

async function readInput(path: string): Promise<Entry[]> {
  const text = await Deno.readTextFileSync(path);

  return text
    .trim()
    .split(/\n/)
    .map((line) => {
      const split = line.split("|");

      return {
        patterns: split[0].trim().split(" ").map(parsePattern),
        output: split[1].trim().split(" ").map(parsePattern),
      };
    });
}

function newPattern() {
  return new Set("abcdefg") as SignalPattern;
}

function makeLights(): SignalPattern[] {
  const lights: SignalPattern[] = [];

  for (let i = 0; i < 10; i++) {
    lights.push(newPattern());
  }

  return lights;
}

// function findAvailableLights(input: Entry[]): SignalPattern[] {
//   const lights = makeLights();

//   for (const line of input) {
//     for (const pattern of line.patterns) {
//       for (const segment of pattern) {
//         for (let i = 0; i < 10; i++) {
//           if (!line.patterns[i].has(segment)) {
//             lights[i].delete(segment);
//           }
//         }
//       }
//     }
//   }

//   return lights;
// }

function print(patterns: SignalPattern[]) {
  console.log(patterns.map((p) => [...p].join("") || "ERROR").join(", "));
}

// function solveEntry(entry: Entry): number {
//   const possibilities = new Array(10).fill(null).map(() => newPattern());

//   for (const pattern of entry.patterns) {
//     const mLights = lights.map((l, i) => [l, i] as const).filter(([l]) => l.size === pattern.size);
//     if (mLights.length === 0) {
//       const light = possibilities[mLights[0][1]];
//       for (const c of mLights[0][0]) {
//         light
//       }
//     }
//   }
// }

async function main() {
  const input = await readInput("./input.txt");
  print(input[0].patterns);
  // const lights = findAvailableLights(input);

  const lengths = [1, 4, 7, 8].map((i) => lights[i].size);

  console.log(lengths);

  const rows = input.map((entry) =>
    entry.output.reduce(
      (acc, o) => (lengths.includes(o.size) ? acc + 1 : acc),
      0
    )
  );

  const sum = rows.reduce((a, b) => a + b, 0);

  // input

  // print(lights);
  console.log({ rows, sum })
}

main();
