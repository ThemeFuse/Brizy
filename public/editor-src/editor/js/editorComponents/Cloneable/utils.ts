import { cloneableItemsSchema } from "./schemas";

export const readItemTypes = (value: unknown): string[] | undefined => {
  const parsed = cloneableItemsSchema.safeParse(value);

  return parsed.success ? parsed.data.items.map(({ type }) => type) : undefined;
};
