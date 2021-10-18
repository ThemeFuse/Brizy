import { Point, Rect } from "./types";
import { isInsideRect, shrinkRect } from "./utils";

interface Config {
  nearEdgeTest: number;
  nearEdgeThreshold: number;
}

export interface SortableBox {
  rect: Rect;
  depth: number;
  zIndex: number;
  type: "vertical" | "horizontal";
}

export const findClosestSortable = (config: Config) => <T extends SortableBox>(
  boxes: T[],
  point: Point
): T | undefined => {
  const { x, y } = point;
  const N = config.nearEdgeTest;

  // get the most deep N boxes that contain the point
  const closestN = boxes.reduce<T[]>((acc, box) => {
    if (isInsideRect(x, y, box.rect)) {
      // if the box has a higher zIndex then all that was found before it,
      // discard the rest, because it's 100% sure that this one will be the final winner
      if (acc.length === 0 || box.zIndex > acc[0].zIndex) {
        acc = [box];
        return acc;
      }

      // if the box has the same zIndex as the ones found thus far,
      // see if it has a high enough depth to qualify for closest N
      if (
        box.zIndex === acc[0].zIndex &&
        (acc.length < N || box.depth > acc[acc.length - 1].depth)
      ) {
        // insert box && make it so the highest depths come first
        // thus giving them higher priority later
        acc.push(box);
        acc.sort((a, b) => b.depth - a.depth);

        // trick to delete all the elements after acc[N-1]
        // like a mutable Array.slice(0, N)
        if (acc.length > N) {
          acc.length = N;
        }

        return acc;
      }
    }

    return acc;
  }, []);

  switch (closestN.length) {
    case 0:
      return undefined;
    case 1:
      return closestN[0];
    default: {
      const first = closestN[0];
      const shrinkBy = config.nearEdgeThreshold;

      for (let i = 1; i < closestN.length; i++) {
        const current = closestN[i];

        // this solves the case when there is no space between nested boxes,
        // e.g. when there are columns with no margin between them inside a row.
        // we shrink the box a little to see if the point is still inside it.
        // if it isn't, this means that we are close to it's edge and should
        // return the containing ("parent") box instead
        if (
          !isInsideRect(
            x,
            y,
            shrinkRect(
              first.rect,
              shrinkBy,
              current.type === "vertical" ? "top-bottom" : "left-right"
            )
          )
        ) {
          return current;
        }
      }

      return first;
    }
  }
};
