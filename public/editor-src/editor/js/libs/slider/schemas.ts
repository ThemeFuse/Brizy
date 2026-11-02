import { z } from "zod";

const touchPointSchema = z.object({ pageX: z.number(), pageY: z.number() });

/** A gesture's `touches`: a `TouchList` or a plain array of points. */
export const touchesSchema = z.union([
  z.array(touchPointSchema),
  z.object({ length: z.number(), 0: touchPointSchema.optional() })
]);
