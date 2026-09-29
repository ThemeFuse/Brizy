import { readFileSync } from "fs";
import path from "path";
import { noop } from "es-toolkit";
import React from "react";
import { renderWithProviders } from "test-utils";
import type { Props as EditorComponentProps } from "visual/editorComponents/EditorComponent";
import type { Model } from "visual/editorComponents/EditorComponent/types";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { Mode } from "visual/global/Config/types/configs/ConfigCommon";
import { I18nextProvider } from "visual/providers/I18nProvider";
import { hydrate } from "visual/redux/actions";
import { createStore } from "visual/redux/store";
import { makeAttr } from "visual/utils/i18n/attribute";
import {
  config as mockConfig,
  mockDataForReduxStore
} from "../../../../../jest-utils/mocks";
import {
  badgeSelector,
  barSelector,
  buttonSelector,
  dialogFooterSelector,
  dialogSelector,
  switchSliderSelector
} from "../css";
import defaultValue from "../defaultValue.json";
import CookieBanner from "../index";
import type { Props, Value } from "../types";
import { getCategories } from "../utils";

// The published markup never renders a Toolbar (that is the editor path), but
// importing the element pulls the whole editor sidebar tree in with it — and
// with it fontkit, which needs browser globals jsdom does not provide. Stub it
// so this test loads only what the view render actually uses.
jest.mock("visual/component/Toolbar", () => ({
  __esModule: true,
  default: (): null => null
}));

// The published markup of the cookie banner is a contract: export.ts finds its
// nodes through `data-brz-cc` hooks, every toolbar option writes CSS through a
// `{{WRAPPER}} .brz-cookie-banner__*` selector, and the SCSS styles the same
// BEM tokens. Any of the three can be silently broken by an "optimisation" of
// the render, so all three are pinned here against the REAL component output.

const store = createStore();

store.dispatch({
  // `hydrate` is untyped JS, so its `type` widens to `string`; restating it in
  // the dispatched literal keeps the action inside `ReduxAction`.
  ...hydrate({ ...mockDataForReduxStore, symbols: [] }),
  type: "HYDRATE"
});

const dbValue: Model<Value> = {
  ...defaultValue.content,
  items: [],
  currentView: "banner",
  badgePosition: "bottomLeft"
};

// `getGlobalConfig` is read by EditorComponent at runtime but is missing from
// its Props type; declaring it here keeps the object typed without a cast.
const props: EditorComponentProps<Value, Props> & {
  getGlobalConfig: () => ConfigCommon;
} = {
  _id: "cookie-banner-under-test",
  dbValue,
  defaultValue: dbValue,
  path: [],
  reduxStore: store,
  reduxState: store.getState(),
  reduxDispatch: store.dispatch,
  meta: {},
  onChange: noop,
  onToolbarOpen: noop,
  onToolbarClose: noop,
  onToolbarEnter: noop,
  onToolbarLeave: noop,
  extendParentToolbar: noop,
  renderContext: "view",
  editorMode: Mode.page,
  getGlobalConfig: () => mockConfig
};

// TextEditor (behind every <Text />) reads the translation dictionary through
// a hook, so the element has to sit inside the i18n provider like it does on a
// real page.
const { container } = renderWithProviders(
  React.createElement(I18nextProvider, {
    children: React.createElement(CookieBanner, props)
  }),
  { renderContext: "view" }
);

// Testing Library unmounts the tree after every test, so the published markup
// is captured once, as the string a visitor would be served, and every
// assertion below runs against that snapshot of the real render.
const html = container.innerHTML;

const doc = new DOMParser().parseFromString(html, "text/html");
const root = doc.querySelector(".brz-cookie-banner");

if (!root) {
  throw new Error("CookieBanner did not render a .brz-cookie-banner root");
}

const cc = makeAttr("cc");
const ccCategory = makeAttr("cc-category");

const hook = (value: string): string => `[${cc}="${value}"]`;

describe("CookieBanner markup — runtime hooks", () => {
  it.each([
    { hook: "banner", count: 1 },
    { hook: "badge", count: 1 },
    { hook: "backdrop", count: 1 },
    { hook: "dialog", count: 1 },
    { hook: "reject", count: 1 },
    { hook: "customize", count: 1 },
    { hook: "save", count: 1 },
    // one in the bar, one in the dialog footer
    { hook: "accept", count: 2 }
  ])("has $count element(s) for $hook", ({ hook: value, count }) => {
    expect(root.querySelectorAll(hook(value))).toHaveLength(count);
  });

  it.each(
    getCategories().map(({ key, locked }) => ({
      key,
      locked: locked === true
    }))
  )("has one toggle for the $key category", ({ key, locked }) => {
    const toggles = root.querySelectorAll<HTMLInputElement>(
      `input[type="checkbox"]${hook("category-toggle")}[${ccCategory}="${key}"]`
    );

    expect(toggles).toHaveLength(1);
    // the locked category is the visitor's non-negotiable one: on and frozen
    expect(toggles[0].checked).toBe(locked);
    expect(toggles[0].disabled).toBe(locked);
  });

  // jest-dom's matchers reject nodes from a parsed document, so visibility is
  // asserted through classList directly.
  it.each([
    {
      case: "the badge is hidden until export.ts reveals it",
      value: "badge",
      hidden: true
    },
    {
      case: "the dialog backdrop is hidden too",
      value: "backdrop",
      hidden: true
    },
    { case: "the bar itself is visible", value: "banner", hidden: false }
  ])("$case", ({ value, hidden }) => {
    expect(
      root.querySelector(hook(value))?.classList.contains("brz-hidden")
    ).toBe(hidden);
  });

  it("renders the element root with the brz-cookie-banner class", () => {
    expect(root.classList.contains("brz-cookie-banner")).toBe(true);
  });

  // Node budget, so a wrapper cannot creep back in unnoticed: 1 root + 9 for
  // the bar (bar, text, buttons + 3 buttons with their span) + 8 for the badge
  // (badge + svg with 6 paths) + 39 for the dialog (backdrop, dialog, title,
  // body + 5 category rows of 6 nodes each + footer with 2 buttons and their
  // span).
  it("stays within its node budget", () => {
    expect(root.querySelectorAll("*").length + 1).toBe(57);
  });
});

// `{{WRAPPER}}` is substituted with the element's own class when the CSS is
// generated, so the selectors are resolved against the rendered markup the
// same way the browser resolves them on the published page.
const resolve = (selector: string): string =>
  selector.replace("{{WRAPPER}}", ".brz-cookie-banner");

describe("CookieBanner markup — toolbar CSS selectors resolve", () => {
  it.each([
    { name: "barSelector", selector: barSelector },
    { name: "badgeSelector", selector: badgeSelector },
    { name: "dialogSelector", selector: dialogSelector },
    { name: "dialogFooterSelector", selector: dialogFooterSelector },
    { name: "switchSliderSelector", selector: switchSliderSelector },
    // the two literals toolbar.ts duplicates instead of importing from css.ts
    {
      name: "toolbar.ts bar literal",
      selector: "{{WRAPPER}} .brz-cookie-banner__bar"
    },
    {
      name: "toolbar.ts dialog literal",
      selector: "{{WRAPPER}} .brz-cookie-banner__dialog"
    },
    ...["accept", "reject", "customize", "dialog-accept", "save"].map(
      (modifier) => ({
        name: `buttonSelector(${modifier})`,
        selector: buttonSelector(modifier)
      })
    )
  ])("$name matches an element", ({ selector }) => {
    expect(doc.querySelector(resolve(selector))).not.toBeNull();
  });
});

const scss = readFileSync(
  path.resolve(
    __dirname,
    "../../../../sass/editorComponents/cookie-banner.scss"
  ),
  "utf8"
);

// `&__foo` inside the `.brz-cookie-banner` block and any fully written
// `.brz-cookie-banner__foo` are the same thing once SCSS is compiled.
const scssTokens = [
  ...new Set(
    (scss.match(/&__[a-z-]+|\.brz-cookie-banner__[a-z-]+/g) ?? []).map(
      (token) => token.replace(/^&__|^\.brz-cookie-banner__/, "")
    )
  )
].sort();

describe("CookieBanner markup — SCSS has no orphan selectors", () => {
  it("found the stylesheet", () => {
    expect(scssTokens.length).toBeGreaterThan(0);
  });

  it.each(scssTokens.map((token) => ({ token })))(
    "brz-cookie-banner__$token is rendered",
    ({ token }) => {
      expect(doc.querySelector(`.brz-cookie-banner__${token}`)).not.toBeNull();
    }
  );
});
