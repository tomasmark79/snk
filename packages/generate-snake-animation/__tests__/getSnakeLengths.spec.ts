import { expect, it } from "bun:test";
import { createEmptyGrid } from "@snk/types/grid";
import { createSnakeFromCells } from "@snk/types/snake";
import { getSnakeLengths } from "../getSnakeLengths";
import { createSnake } from "@snk/svg-creator/snake";

it("grows on new nonempty cells beyond 20 and honors the ratio", () => {
  const grid = createEmptyGrid(180, 1);
  grid.data.fill(4);
  grid.data[0] = 0;
  const pose = (x: number) => createSnakeFromCells([{ x, y: 0 }]);
  const route = [
    pose(-1),
    pose(0),
    ...Array.from({ length: 179 }, (_, i) => pose(i + 1)),
    pose(1),
  ];
  const sizes = getSnakeLengths(grid, route);
  expect(sizes.slice(0, 11)).toEqual(Array(11).fill(4));
  expect(sizes[11]).toBe(5);
  expect(sizes[161]).toBe(20);
  expect(sizes.at(-1)).toBe(21);
  expect(getSnakeLengths(grid, Array(30).fill(pose(1)))).toEqual(
    Array(30).fill(4),
  );
  expect(getSnakeLengths(grid, route)).toEqual(sizes);
});

it("scales each current tail to 5%, hides unborn segments and resets on loop", () => {
  const pose = createSnakeFromCells(
    Array.from({ length: 40 }, (_, x) => ({ x, y: 0 })),
  );
  const result = createSnake(
    [pose, pose, pose],
    { sizeCell: 16, sizeDot: 12, colorSnake: "blue" },
    300,
    [4, 21, 40],
  );
  const css = result.styles.join("");
  expect(css).toContain(".b0{transform:scale(1)");
  expect(css).toContain(".b4{transform:scale(0)");
  expect(css).toContain("@keyframes b39");
  expect(css).toContain("100%");
  expect(css).toContain("scale(0.050000000000000044)");
});
