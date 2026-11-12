import { type Encryption, encryptionSchema, portSchema } from "./schemas";

const IMPLICIT_SSL_PORT = "465";

const encryptionForPort = (port: unknown): Encryption => {
  const parsed = portSchema.safeParse(port);

  return parsed.success && parsed.data === IMPLICIT_SSL_PORT ? "ssl" : "tls";
};

/**
 * The Encryption select always shows one of its options, so an unset value
 * must resolve to the option that is shown and saved: the stored or picked
 * choice if there is one, otherwise the mode the port implies (465 is
 * implicit SSL, any other port STARTTLS). Steps without an encryption field
 * are returned unchanged.
 */
export const withEncryption = (
  values: Record<string, unknown>
): Record<string, unknown> => {
  if (
    !("encryption" in values) ||
    encryptionSchema.safeParse(values.encryption).success
  ) {
    return values;
  }

  return { ...values, encryption: encryptionForPort(values.port) };
};
