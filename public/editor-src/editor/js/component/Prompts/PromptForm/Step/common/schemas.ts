import { z } from "zod";

// The saved integration comes back with some fields as numbers (the SMTP
// port), so a number reads as its text instead of hiding the field.
export const textValueSchema = z.union([
  z.string(),
  z.number().transform(String),
  z.null()
]);

// A multiple search keeps its choices as comma-separated text, so a list
// reads as that same text.
export const searchValueSchema = z.union([
  textValueSchema,
  z.array(z.string()).transform((values) => values.join(","))
]);

export const encryptionSchema = z.enum(["ssl", "tls"]);

export type Encryption = z.infer<typeof encryptionSchema>;

// typed into an input as a string, but a stored integration may return a number
export const portSchema = z
  .union([z.string(), z.number()])
  .transform((port) => String(port).trim());
