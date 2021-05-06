import * as Opacity from "./opacity";
import { testMonoid } from "visual/utils/types/Monoid.test";

describe("Testing Opacity monoidal behavior", function() {
  const valid = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(
    Opacity.unsafe
  );
  testMonoid(Opacity, valid);
});
