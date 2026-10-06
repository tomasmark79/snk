import { expect, it } from "bun:test";
import { createSnakeFromCells, snakeToCells } from "@snk/types/snake";
import { extendSnakeTrail } from "../extendSnakeTrail";
import { createSnake } from "@snk/svg-creator/snake";

it("keeps a 20-logo trail continuous across the animation loop", () => {
  const route = [
    ...Array.from({ length: 12 }, (_, x) => ({ x, y: 0 })),
    ...Array.from({ length: 3 }, (_, y) => ({ x: 11, y: y + 1 })),
    ...Array.from({ length: 11 }, (_, x) => ({ x: 10 - x, y: 3 })),
    ...Array.from({ length: 2 }, (_, y) => ({ x: 0, y: 2 - y })),
  ];
  const chain = route.map((_, i) =>
    createSnakeFromCells(
      Array.from(
        { length: 4 },
        (_, j) => route[(i - j + route.length) % route.length],
      ),
    ),
  );
  chain.push(chain[0]);

  const extended = extendSnakeTrail(chain, 20);
  expect(extended).toHaveLength(chain.length);
  expect(extended.at(-1)).toEqual(extended[0]);
  extended.forEach((pose, i) => {
    const cells = snakeToCells(pose);
    expect(cells).toHaveLength(20);
    expect(new Set(cells.map(({ x, y }) => `${x},${y}`)).size).toBe(20);
    expect(cells[0]).toEqual(snakeToCells(chain[i])[0]);
    if (i > 0)
      expect(cells.slice(1)).toEqual(
        snakeToCells(extended[i - 1]).slice(0, -1),
      );
  });

  const svg = createSnake(
    extended,
    { sizeCell: 16, sizeDot: 12, colorSnake: "purple" },
    1000,
  );
  const elements = svg.svgElements.join("");
  expect(elements.match(/<symbol /g)).toHaveLength(1);
  expect(elements.match(/href="#nixos-snowflake"/g)).toHaveLength(20);
  expect(elements).not.toContain("<rect");
  expect(svg.styles.join("")).toContain("@keyframes s19");
});

it("handles empty and stationary routes", () => {
  expect(extendSnakeTrail([], 20)).toEqual([]);
  const pose = createSnakeFromCells([{ x: 0, y: 0 }]);
  expect(snakeToCells(extendSnakeTrail([pose], 20)[0])).toHaveLength(20);
});
