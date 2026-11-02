import columnDefaultValue from "visual/editorComponents/Column/defaultValue.json";
import { styleColumn } from "visual/editorComponents/Column/styles";
import { flattenDefaultValue } from "visual/editorComponents/EditorComponent/utils";
import rowDefaultValue from "visual/editorComponents/Row/defaultValue.json";
import { styleRow } from "visual/editorComponents/Row/styles";
import { Mode } from "visual/global/Config/types/configs/ConfigCommon";
import { createStore } from "visual/redux/store";
import type { StylesContexts } from "visual/types";
import { jestGetConfig } from "../../../../../jest-utils/mocks";

const store = createStore({ middleware: [] });

const contextsOf = (
  renderContext: StylesContexts["renderContext"]
): StylesContexts => ({
  renderContext,
  mode: Mode.page,
  getConfig: jestGetConfig
});

const rotate = { transformRotateEnabled: true, transformRotateRotate: 15 };
const hover = ".brz-hover-animation__container";
const motion = "div[data-scroll-motion]";

describe.each([
  {
    element: "Row",
    style: styleRow,
    defaults: flattenDefaultValue(rowDefaultValue),
    transform: ".brz-row__transform",
    layout:
      "display:flex;width:100%; min-height:inherit; align-items:inherit; justify-content:inherit;",
    bg: "inset-inline-start:auto;"
  },
  {
    element: "Column",
    style: styleColumn,
    defaults: flattenDefaultValue(columnDefaultValue),
    transform: ".brz-columns__transform",
    layout: "flex-direction:column; height:100%;",
    bg: "width:auto; height:auto; inset:0;"
  }
])(
  "$element transform styles",
  ({ style, defaults, transform, layout, bg }) => {
    const render = (
      patch: Record<string, unknown>,
      renderContext: StylesContexts["renderContext"]
    ): string => {
      const v = { ...defaults, ...patch };
      const contexts = contextsOf(renderContext);

      return style({ v, vs: defaults, vd: defaults, store, contexts }).join("");
    };

    it("emits nothing for the transform div while no effect is enabled", () => {
      const css = render({}, "editor");

      expect(css).not.toContain(transform);
      expect(css).toContain(".brz && > .brz-bg{");
    });

    it.each([
      { case: "no other wrapper", patch: {}, parent: "" },
      {
        case: "a hover animation",
        patch: { hoverName: "pulse" },
        parent: `${hover} > `
      },
      {
        case: "a scroll motion",
        patch: { motionVerticalEnabled: true },
        parent: `${motion} > `
      },
      {
        case: "a scroll motion and a hover animation",
        patch: { motionVerticalEnabled: true, hoverName: "pulse" },
        parent: `${motion} > ${hover} > `
      }
    ])("nests the transform div inside $case", ({ patch, parent }) => {
      const css = render({ ...rotate, ...patch }, "editor");
      const selector = `.brz && > ${parent}${transform}`;

      expect(css).toContain(`${selector}{`);
      expect(css).toContain("transform:  rotateZ(var(--transform-rotateZ));");
      expect(css).toContain(`${selector} > .brz-bg{`);
      expect(css).not.toContain(`.brz && > ${parent}.brz-bg{`);
    });

    it.each<{ renderContext: StylesContexts["renderContext"] }>([
      { renderContext: "editor" },
      { renderContext: "view" }
    ])(
      "lays the transform div out from the element styles in $renderContext",
      ({ renderContext }) => {
        const css = render(rotate, renderContext);

        expect(css).toContain(layout);
        expect(css).toContain(bg);
      }
    );

    it("keeps a device override in its own media query", () => {
      const css = render(
        { ...rotate, mobileTransformRotateEnabled: false },
        "editor"
      );

      expect(css).toContain(
        `@media(max-width:767px){.brz && > ${transform}{transform: none;}`
      );
    });
  }
);

describe("Column hidden on desktop", () => {
  const defaults = flattenDefaultValue(columnDefaultValue);
  const v = { ...defaults, ...rotate, showOnDesktop: "off" };

  it.each<{
    renderContext: StylesContexts["renderContext"];
    display: string;
  }>([
    { renderContext: "view", display: "display:none;" },
    {
      renderContext: "editor",
      display: "display:var(--elements-visibility, flex);"
    }
  ])(
    "hides the transform div in $renderContext",
    ({ renderContext, display }) => {
      const contexts = contextsOf(renderContext);
      const css = styleColumn({
        v,
        vs: defaults,
        vd: defaults,
        store,
        contexts
      });

      expect(css.join("")).toContain(
        `@media(min-width:991px){.brz && > .brz-columns__transform{display:flex;${display}}`
      );
    }
  );
});
