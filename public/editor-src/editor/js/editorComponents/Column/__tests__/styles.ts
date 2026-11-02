import { flattenDefaultValue } from "visual/editorComponents/EditorComponent/utils";
import { Mode } from "visual/global/Config/types/configs/ConfigCommon";
import type { RenderType } from "visual/providers/RenderProvider";
import { createStore } from "visual/redux/store";
import { jestGetConfig } from "../../../../../jest-utils/mocks";
import defaultValue from "../defaultValue.json";
import { styleColumn } from "../styles";

interface Case {
  case: string;
  renderContext: RenderType;
  patch: Record<string, unknown>;
  rule: string;
  medias: string[];
}

const store = createStore({ middleware: [] });
const defaults = flattenDefaultValue(defaultValue);
const mediaBlock = /@media([^{]+)\{((?:[^{}]+\{[^{}]*\})*)\}/g;

const desktop = "(min-width:991px)";
const tablet = "(max-width:991px) and (min-width:768px)";
const mobile = "(max-width:767px)";

// both selectors must outweigh `.brz .brz-columns div[data-scroll-motion]` from column.scss
const preview =
  ".brz && > .brz-columns__scroll-effect.brz-motion--effects{display:none;}";
const editor =
  ".brz && > .brz-columns__scroll-effect[data-scroll-motion]{display:var(--elements-visibility, flex);}";

const cases: Case[] = [
  {
    case: "a preview column hidden on desktop",
    renderContext: "view",
    patch: { showOnDesktop: "off" },
    rule: preview,
    medias: [desktop]
  },
  {
    case: "a preview column hidden on tablet",
    renderContext: "view",
    patch: { showOnTablet: "off" },
    rule: preview,
    medias: [tablet]
  },
  {
    case: "a preview column hidden on mobile",
    renderContext: "view",
    patch: { showOnMobile: "off" },
    rule: preview,
    medias: [mobile]
  },
  {
    case: "a preview column shown on every device",
    renderContext: "view",
    patch: {},
    rule: preview,
    medias: []
  },
  {
    case: "an editor column hidden on desktop",
    renderContext: "editor",
    patch: { showOnDesktop: "off" },
    rule: editor,
    medias: [desktop]
  },
  {
    case: "an editor column hidden on tablet",
    renderContext: "editor",
    patch: { showOnTablet: "off" },
    rule: editor,
    medias: [tablet]
  },
  {
    case: "an editor column hidden on mobile",
    renderContext: "editor",
    patch: { showOnMobile: "off" },
    rule: editor,
    medias: [mobile]
  },
  {
    case: "an editor column shown on every device",
    renderContext: "editor",
    patch: {},
    rule: editor,
    medias: []
  }
];

describe("Column scroll motion wrapper visibility", () => {
  it.each(cases)(
    "scopes the hide rule to the hidden device for $case",
    ({ renderContext, patch, rule, medias }) => {
      const css = styleColumn({
        v: { ...defaults, motionVerticalEnabled: true, ...patch },
        vs: defaults,
        vd: defaults,
        store,
        contexts: { renderContext, mode: Mode.page, getConfig: jestGetConfig }
      }).join("");
      const found = [...css.matchAll(mediaBlock)]
        .filter(([, , rules]) => rules.includes(rule))
        .map(([, media]) => media);

      expect([...new Set(found)]).toEqual(medias);
      expect(css.replace(mediaBlock, "")).not.toContain(rule);
    }
  );
});
