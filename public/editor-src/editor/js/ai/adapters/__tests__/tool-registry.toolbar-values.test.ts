import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { dirname, join, resolve } from "path";
import { constraintOf } from "@brizy/ai-tools";
import { z } from "zod";
import {
  defaultValueKey,
  parseDefaultValueKey
} from "visual/utils/onChange/device";
import { DESKTOP } from "visual/utils/responsiveMode";
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

/** The index of the "{" opening the object that encloses position `at`. */
const enclosingOpen = (s: string, at: number): number => {
  let depth = 0;
  for (let i = at - 1; i >= 0; i--) {
    if (s[i] === "}") depth += 1;
    else if (s[i] === "{") {
      if (depth === 0) return i;
      depth -= 1;
    }
  }
  return -1;
};

/** One literal option declaration, and whether it survives off desktop. */
interface OptionReach {
  readonly id: string;
  readonly type: string;
  readonly reachable: boolean;
}

/**
 * Every literal option declaration, and whether it can be reached off desktop.
 *
 * An option is hidden on tablet and mobile when it says `devices: "desktop"`
 * or sits inside a popover, group or tabs option that does — the toolbar
 * filter drops a restricted container with everything in it. An enclosing
 * object without a `type` is a tab or a choice rather than an option, and the
 * filter never reads `devices` off those, so they do not count.
 */
const optionReach = (files: readonly string[]): OptionReach[] => {
  const out: OptionReach[] = [];
  for (const file of files) {
    const s = read(file);
    for (const m of s.matchAll(/\bid:\s*["']([A-Za-z_]\w*|)["']/g)) {
      let open = enclosingOpen(s, m.index);
      if (open < 0) continue;
      const own = entries(s.slice(open + 1, closing(s, open)));
      const type = literal(own.get("type"));
      if (literal(own.get("id")) !== m[1] || typeof type !== "string") continue;
      if (own.get("disabled") === "true") continue;

      let reachable = true;
      while (open >= 0) {
        const close = closing(s, open);
        if (close < 0) break;
        const option = entries(s.slice(open + 1, close));
        if (
          option.has("type") &&
          literal(option.get("devices")) === "desktop"
        ) {
          reachable = false;
          break;
        }
        open = enclosingOpen(s, open);
      }
      out.push({ id: m[1], type, reachable });
    }
  }
  return out;
};

const SIDES = ["Top", "Right", "Bottom", "Left"];
const COLOR = ["ColorHex", "ColorOpacity", "ColorPalette"];

/** `prefixed("", "FontSize")` → "fontSize"; `prefixed("title", …)` → "titleFontSize". */
const prefixed = (id: string, suffix: string): string =>
  id === ""
    ? `${suffix.charAt(0).toLowerCase()}${suffix.slice(1)}`
    : id + suffix;

/**
 * The keys a compound option writes, by its type.
 *
 * A `padding` option with id "bgPadding" stores `bgPadding`, `bgPaddingTop`
 * and the rest; a `typography` with id "title" stores `titleFontSize`. Only
 * the families are listed whose keys the catalog offers per device — any other
 * option is matched on its id alone, which is how a slider or a select stores.
 */
const FAMILIES: Record<string, (id: string) => readonly string[]> = {
  typography: (id) =>
    [
      "FontSize",
      "FontSizeSuffix",
      "FontWeight",
      "LineHeight",
      "LetterSpacing"
    ].map((suffix) => prefixed(id, suffix)),
  colorPicker: (id) => ["Hex", "Opacity", "Palette"].map((x) => id + x),
  backgroundColor: (id) =>
    [
      "BgColorHex",
      "BgColorOpacity",
      "BgColorPalette",
      "GradientType",
      "GradientColorHex",
      "GradientColorOpacity",
      "GradientColorPalette",
      "GradientLinearDegree",
      "GradientRadialDegree",
      "GradientStartPointer",
      "GradientFinishPointer",
      "GradientStops",
      "GradientSpeed",
      "ActiveStopIndex"
    ].map((suffix) => prefixed(id, suffix)),
  border: (id) =>
    [...COLOR, "Style", "Width", ...SIDES.map((side) => `${side}Width`)].map(
      (suffix) => id + suffix
    ),
  boxShadow: (id) => [
    id,
    ...[...COLOR, "Blur", "Spread", "Vertical", "Horizontal"].map((x) => id + x)
  ],
  textShadow: (id) => [
    id,
    ...[...COLOR, "Blur", "Vertical", "Horizontal"].map((x) => id + x)
  ],
  padding: (id) => [id, ...SIDES.map((side) => id + side)],
  margin: (id) => [id, ...SIDES.map((side) => id + side)],
  corners: (id) =>
    [
      "Radius",
      "TopLeftRadius",
      "TopRightRadius",
      "BottomRightRadius",
      "BottomLeftRadius"
    ].map((suffix) => id + suffix),
  filters: (id) =>
    ["Brightness", "Contrast", "Saturation", "Hue"].map((suffix) =>
      prefixed(id, suffix)
    )
};

const writes = (option: OptionReach, key: string): boolean =>
  (
    FAMILIES[option.type]?.(option.id) ?? [option.id, `${option.id}Suffix`]
  ).includes(key);

/**
 * The key to look an option up by. A value written through an option's active
 * state is stored as `active` + the option's own key, so the option that
 * writes `activeBgColorHex` is the one whose family holds `bgColorHex`.
 */
const optionKeysOf = (desktopKey: string): readonly string[] => {
  const state = desktopKey.match(/^active([A-Z].*)$/);
  return state
    ? [desktopKey, `${state[1].charAt(0).toLowerCase()}${state[1].slice(1)}`]
    : [desktopKey];
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
      // A tablet or mobile value is written by the same option as the
      // desktop one, so it is held to that option's choices and bounds.
      const definitions = options.get(
        defaultValueKey({ ...parseDefaultValueKey(key), device: DESKTOP })
      );
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

/**
 * A tablet or mobile tool offers nothing the toolbar hides on that device.
 *
 * Which keys are responsive is declared by hand in each element's schema, from
 * an audit of its toolbar. This is the check on that list: each device key is
 * traced to the option that writes its desktop key, and when every literal
 * declaration of that option is desktop-only — by its own `devices`, or by a
 * popover, group or tabs option around it — a device value for it is one the
 * user can never see or change in the editor.
 *
 * A desktop-only declaration beside a second one under a `devices:
 * "responsive"` tab is the editor's usual way of offering a subset off
 * desktop, which is why one reachable declaration is enough.
 *
 * It is a negative check over what can be read from source. An option whose
 * id is computed, one built by a helper, and one switched off by a runtime
 * `disabled: device !== "desktop"` are not seen here and are left to the audit.
 */
describe("a device tool offers no key its toolbar hides off desktop", () => {
  const button = optionReach(optionFiles(join(COMPONENTS, "Button")));
  const reaches = (options: readonly OptionReach[], key: string): boolean[] =>
    options
      .filter((option) => optionKeysOf(key).some((k) => writes(option, k)))
      .map((option) => option.reachable);

  it.each([
    {
      case: "a slider in a desktop-only group",
      key: "iconCustomSize",
      out: [false]
    },
    {
      case: "a switch in a desktop-only popover",
      key: "linkExternalBlank",
      out: [false]
    },
    { case: "a radioGroup offered on every device", key: "size", out: [true] },
    {
      case: "a font size, written by a typography option",
      key: "fontSize",
      out: [true]
    },
    {
      case: "a colour, written by a colorPicker option",
      key: "colorHex",
      out: [true]
    }
  ])("reads $case", ({ key, out }) => {
    expect(reaches(button, key)).toEqual(out);
  });

  it.each(cases)("$alias", ({ alias, config }) => {
    const dir = componentDir(config.elementType);
    if (dir === undefined) return;

    const options = optionReach(optionFiles(dir));
    const offered = tools
      .filter((tool) => tool.alias === alias)
      .flatMap((tool) => Object.keys(tool.parameters.properties));

    const hidden = offered.filter((key) => {
      const parsed = parseDefaultValueKey(key);
      if (parsed.device === DESKTOP) return false;

      const declarations = reaches(
        options,
        defaultValueKey({ ...parsed, device: DESKTOP })
      );
      return declarations.length > 0 && !declarations.some(Boolean);
    });

    expect(hidden).toEqual([]);
  });
});
