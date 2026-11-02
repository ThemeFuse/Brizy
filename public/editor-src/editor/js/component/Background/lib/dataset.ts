import { z } from "zod";
import type { VideoSettings } from "./backgroundVideo";

// `$(element).data()` did not hand back strings: it coerced each `data-*` value, and the coerced
// value is what reached the players. `data-loop="false"` arrived as the boolean false, and
// `data-start="10"` as the number 10 — while `data-start="010"` stayed a string, because it does
// not survive the round trip through Number. Reading `dataset` instead would turn every one of
// those into a truthy string.
//
// Ported from jQuery 3.7.1 (`getData`), with one deliberate difference: the literal "null" comes
// back as `undefined`, which every consumer here treats the same way.

const JSON_LIKE = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;

function readDataValue(value: string | undefined): unknown {
  if (value === undefined) {
    return undefined;
  }

  switch (value) {
    case "true":
      return true;
    case "false":
      return false;
    case "null":
      return undefined;
  }

  // Only convert to a number when doing so does not change the string.
  if (value === `${Number(value)}`) {
    return Number(value);
  }

  if (JSON_LIKE.test(value)) {
    return JSON.parse(value);
  }

  return value;
}

const text = z
  .unknown()
  .transform((value) => (typeof value === "string" ? value : undefined));

const videoSettingsSchema = z.object({
  type: text,
  key: text,
  // Every consumer only ever asked whether the loop was on, so a value the coercion left as
  // something other than a boolean keeps the meaning it had: its truthiness.
  loop: z
    .unknown()
    .transform((value) => (value === undefined ? undefined : Boolean(value))),
  start: z
    .unknown()
    .transform((value) =>
      typeof value === "number" || typeof value === "string" ? value : undefined
    )
});

const attribute = (element: HTMLElement, name: string): unknown =>
  readDataValue(element.getAttribute(`data-${name}`) ?? undefined);

/** The settings a published page carries on a `.brz-bg-video` element. */
export function readVideoSettings(element: HTMLElement): VideoSettings {
  const settings = videoSettingsSchema.parse({
    type: attribute(element, "type"),
    key: attribute(element, "key"),
    loop: attribute(element, "loop"),
    start: attribute(element, "start")
  });

  // Spelled out so every field stays required, present and possibly undefined.
  return {
    type: settings.type,
    key: settings.key,
    loop: settings.loop,
    start: settings.start
  };
}
