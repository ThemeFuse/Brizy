import { z } from "zod";

export const consentCategoriesSchema = z.object({
  preferences: z.boolean(),
  statistics: z.boolean(),
  marketing: z.boolean(),
  // Scripts that fit none of the above, including unknown third-party ones
  // gated automatically by the blocker.
  other: z.boolean()
});

export const consentSchema = z.object({
  v: z.literal(1),
  ts: z.number(),
  c: consentCategoriesSchema
});
