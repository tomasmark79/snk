import { getSnakeLength, snakeToCells } from "@snk/types/snake";
import type { Snake } from "@snk/types/snake";
import type { Point } from "@snk/types/point";
import { h } from "./xml-utils";
import { createAnimation } from "./css-utils";
import { nixosLogo } from "./nixos-logo";

export type Options = {
  colorSnake: string;
  sizeCell: number;
  sizeDot: number;
};

export const createSnake = (
  chain: Snake[],
  { sizeCell }: Options,
  duration: number,
  lengths?: number[],
) => {
  const snakeN = chain[0] ? getSnakeLength(chain[0]) : 0;

  const snakeParts: Point[][] = Array.from({ length: snakeN }, () => []);

  for (const snake of chain) {
    const cells = snakeToCells(snake);
    for (let i = cells.length; i--; ) snakeParts[i].push(cells[i]);
  }

  const svgElements = snakeParts.map((_, i) => {
    const s = sizeCell * 0.9;

    const m = (sizeCell - s) / 2;

    return (
      `<g class="s s${i}">` +
      h("use", {
        class: `b b${i}`,
        href: "#nixos-snowflake",
        x: m.toFixed(1),
        y: m.toFixed(1),
        width: s.toFixed(1),
        height: s.toFixed(1),
      }) +
      "</g>"
    );
  });

  const transform = ({ x, y }: Point) =>
    `transform:translate(${x * sizeCell}px,${y * sizeCell}px)`;

  const styles = [
    `.b{transform-origin:${sizeCell / 2}px ${sizeCell / 2}px;animation:none linear ${duration}ms infinite}`,
    ...snakeParts.flatMap((_, segment) => {
      const scale = (length: number) =>
        segment >= length ? 0 : 1 - (0.95 * segment) / Math.max(1, length - 1);
      const sizes = chain.map((_, frame) => scale(lengths?.[frame] ?? snakeN));
      const keyframes = sizes.flatMap((size, frame) => {
        if (frame === 0) return [{ t: 0, style: `transform:scale(${size})` }];
        if (size === sizes[frame - 1]) return [];
        return [
          {
            t: (frame - 1) / chain.length,
            style: `transform:scale(${sizes[frame - 1]})`,
          },
          { t: frame / chain.length, style: `transform:scale(${size})` },
        ];
      });
      if (sizes.length) {
        keyframes.push({
          t: (chain.length - 1) / chain.length,
          style: `transform:scale(${sizes.at(-1)})`,
        });
        keyframes.push({ t: 1, style: `transform:scale(${sizes[0]})` });
      }
      return [
        createAnimation(`b${segment}`, keyframes),
        `.b${segment}{transform:scale(${sizes[0] ?? 0});animation-name:b${segment}}`,
      ];
    }),
    `.s{
      shape-rendering: geometricPrecision;
      animation: none linear ${duration}ms infinite
    }`,

    ...snakeParts.map((positions, i) => {
      const id = `s${i}`;
      const animationName = id;

      const keyframes = removeInterpolatedPositions(
        positions.map((tr, i, { length }) => ({ ...tr, t: i / length })),
      ).map(({ t, ...p }) => ({ t, style: transform(p) }));

      return [
        createAnimation(animationName, keyframes),

        `.s.${id}{
          ${transform(positions[0])};
          animation-name: ${animationName}
        }`,
      ];
    }),
  ].flat();

  // Paint the head last so it stays visible at overlaps.
  return { svgElements: [nixosLogo, ...svgElements.reverse()], styles };
};

const removeInterpolatedPositions = <T extends Point>(arr: T[]) =>
  arr.filter((u, i, arr) => {
    if (i - 1 < 0 || i + 1 >= arr.length) return true;

    const a = arr[i - 1];
    const b = arr[i + 1];

    const ex = (a.x + b.x) / 2;
    const ey = (a.y + b.y) / 2;

    // return true;
    return !(Math.abs(ex - u.x) < 0.01 && Math.abs(ey - u.y) < 0.01);
  });
