import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { z } from "zod";
import { componentConfigs } from "../tool-configs";
import { getBrizyToolDefinitions } from "../tool-registry";

const t = (key: string): string => key;

jest.mock("../../utils/logger", () => ({
  log: { tools: jest.fn(), repository: jest.fn() }
}));

/**
 * A tool may only offer an argument the element it targets actually stores.
 *
 * This is the last silent failure in the chain, and the only one nothing else
 * catches. `tool-registry.shape.test.ts` checks a tool against its zod schema,
 * and the catalog's own tests check the schema against itself — but both halves
 * can agree on a key the component has never heard of. Zod accepts it, the
 * handler writes it into blocksData, the tool answers success, and the page
 * does not change. Every guard upstream of here passes.
 *
 * So the component's own `defaultValue.json` is the authority: it is the shape
 * the editor gives a fresh element, and anything outside it is either an
 * exception named below or a mistake.
 */
const COMPONENTS = join(__dirname, "../../../editorComponents");

/** Every `defaultValue.json` under editorComponents, keyed by its directory. */
const defaultValuesByComponent = (): Map<string, string> => {
  const found = new Map<string, string>();

  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      if (statSync(path).isDirectory()) {
        walk(path);
      } else if (entry === "defaultValue.json") {
        const name = dir.slice(dir.lastIndexOf("/") + 1);
        if (!found.has(name)) found.set(name, path);
      }
    }
  };

  walk(COMPONENTS);
  return found;
};

/**
 * A `defaultValue.json` is one object of named sections, each an object of
 * props — but some sections are plain values, so the record is read loosely
 * and the non-object sections are skipped.
 */
const defaultValueSchema = z.record(z.unknown());
const sectionSchema = z.record(z.unknown());

const storedKeys = (path: string): Set<string> => {
  const parsed = defaultValueSchema.parse(
    JSON.parse(readFileSync(path, "utf8"))
  );
  const keys = new Set<string>();

  for (const section of Object.values(parsed)) {
    const props = sectionSchema.safeParse(section);
    if (!props.success) continue;
    for (const key of Object.keys(props.data)) keys.add(key);
  }

  return keys;
};

/** The tool arguments that are not element props at all. */
const ANCHORS = ["elementId", "containerId", "insertIndex", "formId"];

/**
 * A hover or active value is often absent from `defaultValue.json` —
 * `defaultValueValue` falls back from `hoverBgColorHex` to `bgColorHex` when the
 * state has no value of its own, so the stored shape carries only the resting
 * one. The prefixed sub-parts spell it mid-key (`subMenuHoverColorHex`).
 *
 * The exemption holds only when that resting counterpart is really there. A key
 * like `hoverName` looks like a state value and is not one — it is the hover
 * animation, and nothing falls back to it — so without this check the guard
 * waves through exactly the arguments it exists to catch.
 */
const restingCounterpart = (key: string): string | undefined => {
  const leading = key.match(/^(?:hover|active)([A-Z].*)$/);
  if (leading) return `${leading[1][0].toLowerCase()}${leading[1].slice(1)}`;

  const mid = key.match(/^(.*[a-z])(?:Hover|Active)([A-Z].*)$/);
  return mid ? `${mid[1]}${mid[2]}` : undefined;
};

const isStateValue = (key: string, stored: ReadonlySet<string>): boolean => {
  const resting = restingCounterpart(key);
  return resting !== undefined && stored.has(resting);
};

/**
 * Keys the element really does carry, just not as a flat entry in
 * `defaultValue.json`. Each one is a shape the editor nests or rewrites, so the
 * check cannot see it — not a licence to add new arguments.
 */
const NESTED_OR_REWRITTEN: Record<string, string> = {
  // Media lives under `images` / `bgVideo` objects; the handler flattens it.
  imageSrc: "stored under the element's images object",
  bgImageSrc: "stored under the element's images object",
  backBgImageSrc: "stored under the element's images object",
  links: "the playlist's clips are a nested list",
  hoverImageSrc: "stored under the element's images object",
  // Font families live under `families`, keyed by prefix.
  fontFamily: "stored under families",
  // Only the Shape has it, and it is written by the story editor.
  anchor: "written by the story editor, not part of the stored default"
};

const isNested = (key: string): boolean =>
  key in NESTED_OR_REWRITTEN || /FontFamily$/.test(key);

/**
 * Whole aliases whose arguments are deliberately not stored props.
 *
 * A RichText keeps its type per tag (`h1FontSize`, `paragraphFontSize`) and in
 * the markup itself, so `updateText` takes plain typography and the repository
 * rewrites the HTML — see infrastructure/repositories/utils/richtext.ts.
 */
const REWRITES_ITS_OWN_MARKUP = new Set(["updateText", "addText"]);

/** Individual arguments a component computes rather than stores. */
const ALLOWED: Record<string, readonly string[]> = {
  // A Chart's series are generated from `labels`/`label` at render time.
  updateChart: [
    "bgColorPalette",
    "label",
    "labels",
    "chartPieItemsFacebookColorOpacity",
    "chartPieItemsTwitterColorOpacity"
  ],
  addChart: ["label", "labels"],
  // How many photos a new gallery starts with and what they show; the
  // handler turns them into the gallery's items.
  addImageGallery: ["imageCount", "imageDescription"],
  // How many photos join an existing gallery and what they show; the
  // handler appends them to the gallery's items.
  addImageGalleryPhotos: ["imageCount", "imageDescription"],
  // What the picture shows; the chat backend turns it into an imageSrc.
  addImage: ["imageDescription"]
};

const byAlias = new Map(componentConfigs.map((c) => [c.alias, c]));
const defaults = defaultValuesByComponent();

const cases = getBrizyToolDefinitions(t)
  .filter((tool) => byAlias.has(tool.alias))
  .map((tool) => ({ name: tool.name, tool }));

describe("every argument a tool offers is a prop its element stores", () => {
  it("finds a defaultValue.json for every element the catalog targets", () => {
    const unresolved = [...byAlias.values()]
      .map((config) => config.elementType)
      .filter((elementType) => !defaults.has(elementType));

    // StoryShape is created by the story editor and has no stored default.
    expect(unresolved).toEqual(["StoryShape"]);
  });

  it.each(cases)("$name", ({ tool }) => {
    const config = byAlias.get(tool.alias);
    if (config === undefined) return;

    const path = defaults.get(config.elementType);
    if (path === undefined) return;

    const stored = storedKeys(path);
    const allowed = ALLOWED[tool.alias] ?? [];

    const unknown = Object.keys(tool.parameters.properties).filter(
      (key) =>
        !stored.has(key) &&
        !ANCHORS.includes(key) &&
        !isStateValue(key, stored) &&
        !isNested(key) &&
        !allowed.includes(key) &&
        !REWRITES_ITS_OWN_MARKUP.has(tool.alias)
    );

    expect(unknown).toEqual([]);
  });
});
