import {
  createSnakeFromCells,
  getHeadX,
  getHeadY,
  snakeEquals,
} from "@snk/types/snake";
import type { Snake } from "@snk/types/snake";

/** Follow the head's looping route with a longer visual tail. */
export const extendSnakeTrail = (chain: Snake[], length: number): Snake[] => {
  if (!chain.length) return [];
  // The closing pose repeats the first frame and is not another movement step.
  const period =
    chain.length > 1 && snakeEquals(chain[0], chain[chain.length - 1])
      ? chain.length - 1
      : chain.length;

  return chain.map((_, frame) =>
    createSnakeFromCells(
      Array.from({ length }, (_, segment) => {
        const pose = chain[(((frame - segment) % period) + period) % period];
        return { x: getHeadX(pose), y: getHeadY(pose) };
      }),
    ),
  );
};
