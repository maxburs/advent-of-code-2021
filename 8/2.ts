export default null;

const uniqueLengths = [1, 4, 7, 8] as const;

const segments = "abcdefg".split("") as Segment[];

const rawIntendedLights = [
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
];

const intendedLights = rawIntendedLights.map(
  (str) => new Set(str) as SignalPattern
);

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

// function makeLights(): SignalPattern[] {
//   const lights: SignalPattern[] = [];

//   for (let i = 0; i < 10; i++) {
//     lights.push(newPattern());
//   }

//   return lights;
// }

function* notInPattern(pattern: SignalPattern) {
  for (const segment of segments) {
    if (!pattern.has(segment)) {
      yield segment;
    }
  }
}
function patternToRaw(pattern: SignalPattern): string {
  return [...pattern.values()].sort().join("");
}

function patternToNum(pattern: SignalPattern): number {
  const raw = patternToRaw(pattern);
  console.log({ raw })
  return rawIntendedLights.indexOf(raw);
}

function correctPattern(
  pattern: SignalPattern,
  connections: Connections
): SignalPattern {
  const result: SignalPattern = new Set<Segment>();

  for (const segment of pattern) {
    result.add(connections[segment]);
  }

  return result;
}

function print(patterns: SignalPattern[]) {
  console.log(patterns.map((p) => [...p].join("") || "ERROR").join(", "));
}

function segmentCounts(patterns: SignalPattern[]): Map<number, SignalPattern> {
  const counts = Object.fromEntries(
    "abcdefg".split("").map((l) => [l, 0])
  ) as unknown as Record<Segment, number>;

  for (const pattern of patterns) {
    for (const segment of pattern.values()) {
      counts[segment]++;
    }
  }

  const counts2 = new Map<number, SignalPattern>();

  for (const [segment, count] of Object.entries(counts)) {
    let segments = counts2.get(count);
    if (!segments) {
      segments = new Set();
      counts2.set(count, segments);
    }
    segments.add(segment as Segment);
  }

  return counts2;
}

type Connections = Record<Segment, Segment>;
function findConnections(entry: Entry): Connections {
  const possibilities = Object.fromEntries(
    "abcdefg".split("").map((l) => [l as Segment, newPattern()])
  ) as unknown as Record<Segment, Set<Segment>>;

  const remaining = newPattern();

  function remove(signal: Segment, tbr: Iterable<Segment>) {
    const item = possibilities[signal];
    for (const removeMe of tbr) {
      item.delete(removeMe);
    }
    if (item.size === 1) {
      remaining.delete(signal);
    }
  }

  function filter(signal: Segment, tbr: SignalPattern) {
    remove(signal, notInPattern(tbr));
  }

  // Filter by unique lengths
  for (const i of uniqueLengths) {
    const intendedPattern = intendedLights[i];
    for (const signal of intendedPattern) {
      const tbr = entry.patterns.find((l) => l.size === intendedPattern.size)!;
      // console.log('filter', { i, intendedPattern, signal, tbr })
      filter(signal, tbr);
    }
  }

  // Filter by unique segment occurrences
  const intendedCounts = segmentCounts(intendedLights);
  const actualCounts = segmentCounts(entry.patterns);

  for (const [count, segments] of intendedCounts) {
    for (const segment of segments) {
      filter(segment, actualCounts.get(count)!);
    }
  }

  
  // Filter each signal based on signal already used in outputs
  while (remaining.size !== 0) {
    for (const pattern of entry.patterns) {
      const usedTargets = new Set<Segment>();

      for (const signal of pattern) {
        const poss = possibilities[signal];
        if (poss.size === 1) {
          usedTargets.add([...poss.values()][0]);
        }
      }

      for (const signal of pattern) {
        if (remaining.has(signal)) {
          remove(signal, usedTargets);
        }
      }
    }
  }

  console.log({remaining, possibilities });

  return Object.fromEntries(
    [...Object.entries(possibilities)].map(([l, p]) => [
      l,
      p.values().next().value,
    ])
  ) as any;
}

async function main() {
  const entries = await readInput("./example1.txt");
  print(entries[0].patterns);

  let sum = 0;

  for (let i = 0; i < entries.length; i++) {
    console.group(i);
    const entry = entries[i];
    print(entry.patterns);
    const connections = findConnections(entry);

    const output = entry.output
      .map((o) => patternToNum(correctPattern(o, connections)))
      .join("");

    console.log({ output });

    sum += parseInt(output, 10);
    console.groupEnd();
  }
  console.log({ sum });
}

main();
