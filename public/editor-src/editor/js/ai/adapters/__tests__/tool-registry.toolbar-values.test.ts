import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { dirname, join, resolve } from "path";
import { constraintOf } from "@brizy/ai-tools";
import { z } from "zod";
import { componentConfigs } from "../tool-configs";
import { getBrizyToolDefinitions } from "../tool-registry";

const t = (key: string): string => key;

jest.mock("../../utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

/**
 * Every value an element's zod schema accepts is one its toolbar can hold.
 *
 * The toolbar and sidebar option definitions are the editor's own record of
 * what each property may be: a `radioGroup` stores one of its `choices`, a
 * `switch` its `on`/`off` values, a `slider` a number between its `min` and
 * `max`. When zod disagrees, the agent is told a value is valid that the
 * editor never produces — `"left"` for an alignment that only knows
 * `"start"`/`"end"`, or a transition of 10 where the slider goes to 40 — and
 * the call either fails or stores something the element ignores.
 *
 * Only literal definitions are compared: an option whose `choices` or bounds
 * are computed at runtime cannot be read from source and is skipped rather
 * than guessed at. The JSON schema the LLM sees is held to zod separately, by
 * `tool-registry.value-constraints.test.ts`.
 */

const SRC = resolve(__dirname, "..", "..", "..");
const COMPONENTS = join(SRC, "editorComponents");
const EXTS = [".ts", ".tsx", ".js", ".jsx"];
const OPTION_FILE = /(toolbar|sidebar)/i;

/**
 * Keys whose zod deliberately differs from any single option, and why.
 *
 * Add to this only with the reason — it is the whole record of where zod and
 * the toolbar are allowed to part.
 */
const EXCEPTIONS: Record<string, string> = {
  "updateFormField.min":
    "a date or time field writes it through a text input, a number field through the number control",
  "updateFormField.max":
    "a date or time field writes it through a text input, a number field through the number control"
};

const cache = new Map<string, string>();
const read = (path: string): string => {
  const cached = cache.get(path);
  if (cached !== undefined) return cached;
  const text = existsSync(path) ? readFileSync(path, "utf8") : "";
  cache.set(path, text);
  return text;
};

const resolveImport = (spec: string, from: string): string | undefined => {
  const base = spec.startsWith("visual/")
    ? join(SRC, spec.slice("visual/".length))
    : spec.startsWith(".")
      ? resolve(dirname(from), spec)
      : undefined;
  if (base === undefined) return undefined;
  const candidates = [
    ...EXTS.map((ext) => base + ext),
    ...EXTS.map((ext) => join(base, "index" + ext))
  ];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
};

/** A component's option files, and the option files they import from it. */
const optionFiles = (dir: string): readonly string[] => {
  const seeds: string[] = [];
  const walk = (at: string, depth: number): void => {
    for (const entry of readdirSync(at, { withFileTypes: true })) {
      const path = join(at, entry.name);
      if (entry.isDirectory()) {
        if (depth > 0 && entry.name !== "__tests__") walk(path, depth - 1);
      } else if (
        EXTS.some((ext) => entry.name.endsWith(ext)) &&
        OPTION_FILE.test(entry.name)
      ) {
        seeds.push(path);
      }
    }
  };
  walk(dir, 2);

  const seen = new Set<string>();
  const queue = [...seeds];
  while (queue.length > 0) {
    const file = queue.pop();
    if (file === undefined || seen.has(file)) continue;
    seen.add(file);
    for (const m of read(file).matchAll(
      /(?:import|export)[^"']*?from\s*["']([^"']+)["']/g
    )) {
      const next = resolveImport(m[1], file);
      if (
        next !== undefined &&
        !seen.has(next) &&
        OPTION_FILE.test(next) &&
        next.startsWith(COMPONENTS)
      ) {
        queue.push(next);
      }
    }
  }
  return [...seen];
};

/** Where a comment or string starting at `i` ends, or `undefined` if none does. */
const skip = (s: string, i: number): number | undefined => {
  if (s.startsWith("//", i)) {
    const end = s.indexOf("\n", i);
    return end < 0 ? s.length : end;
  }
  if (s.startsWith("/*", i)) {
    const end = s.indexOf("*/", i + 2);
    return end < 0 ? s.length : end + 2;
  }
  const quote = s[i];
  if (quote === '"' || quote === "'" || quote === "`") {
    let j = i + 1;
    while (j < s.length) {
      if (s[j] === "\\") j += 2;
      else if (s[j] === quote) return j + 1;
      else j += 1;
    }
    return s.length;
  }
  return undefined;
};

/** The top-level comma-separated parts of `s` (brackets, strings and comments respected). */
const topLevel = (s: string): readonly string[] => {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  let i = 0;
  while (i < s.length) {
    const past = skip(s, i);
    if (past !== undefined) {
      i = past;
      continue;
    }
    const c = s[i];
    if ("{[(".includes(c)) depth += 1;
    if ("}])".includes(c)) depth -= 1;
    if (c === "," && depth === 0) {
      parts.push(s.slice(start, i));
      start = i + 1;
    }
    i += 1;
  }
  parts.push(s.slice(start));
  return parts.map((p) => p.trim()).filter((p) => p !== "");
};

/** `name: value` pairs of an object literal's body. */
const entries = (body: string): Map<string, string> => {
  const pairs = new Map<string, string>();
  for (const part of topLevel(body)) {
    const m = part.match(/^([A-Za-z_$][\w$]*)\s*:\s*([\s\S]*)$/);
    if (m) pairs.set(m[1], m[2].trim());
  }
  return pairs;
};

const literal = (value: string | undefined): string | number | undefined => {
  if (value === undefined) return undefined;
  const text = value.match(/^["']([^"']*)["']$/);
  if (text) return text[1];
  return /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : undefined;
};

/** Index of the bracket closing the one at `open`. */
const closing = (s: string, open: number): number => {
  let depth = 0;
  let i = open;
  while (i < s.length) {
    const past = skip(s, i);
    if (past !== undefined) {
      i = past;
      continue;
    }
    if ("{[(".includes(s[i])) depth += 1;
    if ("}])".includes(s[i])) {
      depth -= 1;
      if (depth === 0) return i;
    }
    i += 1;
  }
  return -1;
};

/** What one option definition says a property may hold. */
interface OptionTruth {
  readonly type: string;
  /** `undefined` when the option has no choices, or they are computed. */
  readonly choices: readonly (string | number)[] | undefined;
  /** `undefined` when the bound is computed at runtime. */
  readonly min: number | undefined;
  readonly max: number | undefined;
  readonly on: string;
  readonly off: string;
}

const SCALAR = ["radioGroup", "toggle", "select", "switch", "slider", "number"];

/** Every literal scalar option in these files, by id. */
const optionsIn = (files: readonly string[]): Map<string, OptionTruth[]> => {
  const out = new Map<string, OptionTruth[]>();
  for (const file of files) {
    const s = read(file);
    for (const m of s.matchAll(/\bid:\s*["']([A-Za-z_]\w*)["']/g)) {
      // The object this id belongs to: the nearest unmatched "{" before it.
      let depth = 0;
      let open = -1;
      for (let i = m.index - 1; i >= 0; i--) {
        if (s[i] === "}") depth += 1;
        else if (s[i] === "{") {
          if (depth === 0) {
            open = i;
            break;
          }
          depth -= 1;
        }
      }
      if (open < 0) continue;
      const close = closing(s, open);
      if (close < 0) continue;
      const option = entries(s.slice(open + 1, close));
      if (literal(option.get("id")) !== m[1]) continue;
      // A hard-disabled option is a placeholder that can never write.
      if (option.get("disabled") === "true") continue;

      const type = literal(option.get("type"));
      if (typeof type !== "string" || !SCALAR.includes(type)) continue;

      const rawChoices = option.get("choices");
      let choices: (string | number)[] | undefined;
      if (rawChoices?.startsWith("[") && rawChoices.endsWith("]")) {
        const values = topLevel(rawChoices.slice(1, -1)).map((item) =>
          item.startsWith("{")
            ? literal(entries(item.slice(1, -1)).get("value"))
            : undefined
        );
        choices = values.every((v) => v !== undefined)
          ? values.filter((v): v is string | number => v !== undefined)
          : undefined;
      }

      const rawConfig = option.get("config");
      const config = rawConfig?.startsWith("{")
        ? entries(rawConfig.slice(1, -1))
        : new Map<string, string>();
      const bound = (name: string, fallback: number): number | undefined => {
        if (!config.has(name)) return fallback;
        const value = literal(config.get(name));
        return typeof value === "number" ? value : undefined;
      };
      const on = literal(config.get("on"));
      const off = literal(config.get("off"));

      const truth: OptionTruth = {
        type,
        choices,
        // Slider and Number clamp to 0..100 when a bound is left out
        // (component/Options/types/dev/{Slider,Number}).
        min: bound("min", 0),
        max: bound("max", 100),
        on: typeof on === "string" ? on : "on",
        off: typeof off === "string" ? off : "off"
      };
      out.set(m[1], [...(out.get(m[1]) ?? []), truth]);
    }
  }
  return out;
};

const componentDir = (elementType: string): string | undefined => {
  const direct = join(COMPONENTS, elementType);
  if (existsSync(direct)) return direct;
  return readdirSync(COMPONENTS)
    .map((d) => join(COMPONENTS, d, elementType))
    .find((nested) => existsSync(nested));
};

const same = (a: readonly unknown[], b: readonly unknown[]): boolean =>
  JSON.stringify([...a].map(String).sort()) ===
  JSON.stringify([...b].map(String).sort());

/** What is wrong with `field` given one option's truth, or `undefined`. */
const disagreement = (
  field: z.ZodTypeAny,
  truth: OptionTruth
): string | undefined => {
  const accepted = constraintOf(field);

  if (["radioGroup", "toggle", "select"].includes(truth.type)) {
    if (truth.choices === undefined) return undefined;
    const choices = truth.choices;
    if (choices.every((c) => typeof c === "string")) {
      return accepted.enum !== undefined && same(accepted.enum, choices)
        ? undefined
        : `accepts [${accepted.enum?.join("|") ?? accepted.type}], ${truth.type} holds [${choices.join("|")}]`;
    }
    // A closed set of numbers: every choice must parse, and nothing outside.
    const outsider = Math.max(...choices.map(Number)) + 1;
    return choices.every((c) => field.safeParse(c).success) &&
      !field.safeParse(outsider).success
      ? undefined
      : `does not accept exactly [${choices.join("|")}]`;
  }

  if (truth.type === "switch") {
    const want = [truth.on, truth.off];
    return accepted.enum !== undefined && same(accepted.enum, want)
      ? undefined
      : `accepts [${accepted.enum?.join("|") ?? accepted.type}], switch holds [${want.join("|")}]`;
  }

  // slider / number
  if (truth.min === undefined || truth.max === undefined) return undefined;
  return accepted.type === "number" &&
    accepted.minimum === truth.min &&
    accepted.maximum === truth.max
    ? undefined
    : `accepts ${accepted.type} ${String(accepted.minimum)}..${String(accepted.maximum)}, ${truth.type} holds ${truth.min}..${truth.max}`;
};

const tools = getBrizyToolDefinitions(t);
const updateConfigs = componentConfigs.filter(
  (config, i, all) =>
    config.kind === "update" &&
    all.findIndex((c) => c.alias === config.alias) === i
);
const cases = updateConfigs.map((config) => ({ alias: config.alias, config }));

describe("every value an element's zod accepts is one its toolbar can hold", () => {
  it("reads the constraint a toolbar option declares", () => {
    // The case this guard was written for: a radioGroup with two choices,
    // which zod had accepted as any string.
    const truth = optionsIn(optionFiles(join(COMPONENTS, "Accordion"))).get(
      "filterStyle"
    );

    const first = truth?.[0];
    expect(first).toMatchObject({
      type: "radioGroup",
      choices: ["style-1", "style-2"]
    });
    if (first === undefined) return;
    expect(disagreement(z.string(), first)).toBeDefined();
    expect(disagreement(z.enum(["style-1", "style-2"]), first)).toBeUndefined();
  });

  it.each(cases)("$alias", ({ alias, config }) => {
    const dir = componentDir(config.elementType);
    const shape =
      "schema" in config && config.schema instanceof z.ZodObject
        ? config.schema.shape
        : undefined;
    if (dir === undefined || shape === undefined) return;

    const options = optionsIn(optionFiles(dir));
    const offered = new Set(
      tools
        .filter((tool) => tool.alias === alias)
        .flatMap((tool) => Object.keys(tool.parameters.properties))
    );

    const wrong: string[] = [];
    for (const key of offered) {
      const field = shape[key];
      const definitions = options.get(key);
      if (field === undefined || definitions === undefined) continue;
      if (`${alias}.${key}` in EXCEPTIONS) continue;
      for (const truth of definitions) {
        const problem = disagreement(field, truth);
        if (problem !== undefined) wrong.push(`${key}: ${problem}`);
      }
    }

    expect(wrong).toEqual([]);
  });
});
