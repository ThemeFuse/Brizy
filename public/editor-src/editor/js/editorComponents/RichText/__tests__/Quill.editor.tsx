import { render } from "@testing-library/react";
import React from "react";
import { z } from "zod";
import { Mode } from "visual/global/Config/types/configs/ConfigCommon";
import { Sheet } from "visual/providers/StyleProvider/Sheet";
import { hydrate } from "visual/redux/actions";
import {
  defaultFontSelector,
  fontsSignatureSelector
} from "visual/redux/selectors";
import { createStore } from "visual/redux/store";
import {
  jestGetConfig,
  mockDataForReduxStore
} from "../../../../../jest-utils/mocks";
import { QuillComponent } from "../Quill";

// The text element in the editor canvas, before Quill takes it over: without
// an init delay the component only renders the stored markup, with every text
// line tagged for its generated css. Line ids come from a counter.

let mockUuidCount = 0;

jest.mock("visual/utils/uuid", () => ({
  ...jest.requireActual("visual/utils/uuid"),
  uuid: (): string => {
    mockUuidCount += 1;

    return `uid${mockUuidCount}`;
  }
}));

const store = createStore();

store.dispatch({
  ...hydrate({ ...mockDataForReduxStore, symbols: [] }),
  type: "HYDRATE"
});

function markup(value: string): string {
  const state = store.getState();
  const { container } = render(
    <QuillComponent
      value={value}
      defaultFont={defaultFontSelector(state)}
      fontsSignature={fontsSignatureSelector(state)}
      store={store}
      sheet={new Sheet()}
      renderContext="editor"
      editorMode={Mode.page}
      dcGroups={undefined}
      getConfig={jestGetConfig}
      globalBlocksPopupIds={[]}
    />
  );

  return z
    .instanceof(HTMLElement)
    .parse(
      container.querySelector(".brz-ed-content-editable-wrap > div:last-child")
    ).innerHTML;
}

beforeEach(() => {
  mockUuidCount = 0;
});

describe("the text element's markup in the editor", () => {
  it.each([
    {
      case: "a paragraph",
      in: `<p class="brz-tp-lg-paragraph brz-text-lg-center"><span class="brz-cp-color7">Text</span></p>`
    },
    {
      case: "a line that already has an id",
      in: `<p class="brz-tp-lg-paragraph" data-uniq-id="abcde" data-generated-css="brz-css-old">Text</p>`
    },
    {
      case: "every heading level",
      in: `<h1 class="brz-tp-lg-heading1">1</h1><h2 class="brz-tp-lg-heading2">2</h2><h3 class="brz-tp-lg-heading3">3</h3><h4 class="brz-tp-lg-heading4">4</h4><h5 class="brz-tp-lg-heading5">5</h5><h6 class="brz-tp-lg-heading6">6</h6>`
    },
    {
      case: "heading tags outside h1 to h6",
      in: `<h0 class="brz-tp-lg-heading1">0</h0><h7 class="brz-tp-lg-heading2">7</h7><h9>9</h9>`
    },
    {
      case: "list items",
      in: `<ul><li class="brz-tp-lg-paragraph">a</li><li>b</li></ul><ol><li class="brz-tp-lg-heading3">c</li></ol>`
    },
    {
      case: "a preformatted block",
      in: `<pre class="brz-tp-lg-paragraph">code</pre>`
    },
    {
      case: "dynamic content blocks",
      in: `<div class="brz-tp__dc-block brz-tp-lg-paragraph"><span>{{post}}</span></div><div><div class="brz-tp-lg-heading1">in</div></div>`
    },
    {
      case: "tooltip spans",
      in: `<p class="brz-tp-lg-paragraph"><span data-tooltip="%7B%7D">a</span><span data-brz-tooltip="%7B%7D">b</span><span class="plain">c</span></p>`
    },
    {
      case: "a line without classes",
      in: `<p>Tom &amp; Jerry&nbsp;&lt;3 <br>é 😀</p>`
    },
    {
      case: "text outside any line",
      in: `lead <span>only</span> tail`
    },
    {
      case: "an empty text",
      in: ``
    }
  ])("tags $case", ({ in: value }) => {
    expect(markup(value)).toMatchSnapshot();
  });
});
