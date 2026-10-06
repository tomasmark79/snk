import { getColor, isInside } from "@snk/types/grid";
import type { Grid } from "@snk/types/grid";
import { getHeadX, getHeadY } from "@snk/types/snake";
import type { Snake } from "@snk/types/snake";

export const snakeGrowth = {
  initialLength: 4,
  cellsPerSegment: 10,
  maxLength: 20,
};

/** Count each nonempty cell once, regardless of its contribution count. */
export const getSnakeLengths = (grid: Grid, chain: Snake[]): number[] => {
  const eaten = new Set<string>();
  return chain.map((snake) => {
    const x = getHeadX(snake);
    const y = getHeadY(snake);
    if (isInside(grid, x, y) && getColor(grid, x, y)) eaten.add(`${x},${y}`);
    return Math.min(
      snakeGrowth.maxLength,
      snakeGrowth.initialLength +
        Math.floor(eaten.size / snakeGrowth.cellsPerSegment),
    );
  });
};
