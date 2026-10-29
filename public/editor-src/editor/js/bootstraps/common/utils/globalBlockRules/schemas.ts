import { z } from "zod";

/**
 * A global-block rule as the API stores it: one entity per condition row,
 * with a column for every kind of target instead of the editor's flat
 * `entityType` + `entityValues` pair.
 *
 * Absent columns arrive as `null` on the wire, so each of them accepts both
 * spellings; a rule that fails this schema is an old flat rule (WordPress
 * still sends those) and must be left alone.
 */
export const ruleEntitySchema = z.object({
  mode: z.enum(["include", "exclude"]),
  type: z.enum(["specific", "referenced"]),
  entityType: z.string().nullish(),
  entityTypeSlug: z.string().nullish(),
  entityId: z.string().nullish(),
  entityTypeField: z.string().nullish(),
  fieldValueItem: z.string().nullish(),
  externalType: z.string().nullish(),
  externalId: z.string().nullish()
});

export type RuleEntity = z.infer<typeof ruleEntitySchema>;

/**
 * The part of `modules.shop` that names the shop collection types. The host
 * sends `null` — or an empty string — for a type it has not configured.
 */
export const shopExternalTypesSchema = z.object({
  ecwidCategoryTypeId: z.string().nullish(),
  ecwidProductTypeId: z.string().nullish()
});
