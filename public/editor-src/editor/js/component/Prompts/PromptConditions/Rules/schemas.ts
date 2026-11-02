import { z } from "zod";

// The rejection reason handed to `syncFail` is whatever the api rejected with:
// an Error, a parsed json body, a string, anything. Only a `message` string is
// usable as a toast; everything else falls back to the generic copy.
export const rejectionMessageSchema = z
  .object({ message: z.string() })
  .transform(({ message }) => message);
