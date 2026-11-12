import { z } from "zod";

export const cloneableItemsSchema = z.object({
  items: z.array(z.object({ type: z.string() }))
});
