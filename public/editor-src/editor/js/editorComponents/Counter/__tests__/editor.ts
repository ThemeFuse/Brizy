import { noop } from "es-toolkit";
import React from "react";
import { Provider } from "react-redux";
import { act, renderWithProviders } from "test-utils";
import type { ElementModel } from "visual/component/Elements/Types";
import type { Props as EditorComponentProps } from "visual/editorComponents/EditorComponent";
import type { Model } from "visual/editorComponents/EditorComponent/types";
import { Mode } from "visual/global/Config/types/configs/ConfigCommon";
import { StyleProvider } from "visual/providers/StyleProvider";
import { hydrate } from "visual/redux/actions";
import { createStore } from "visual/redux/store";
import {
  config as mockConfig,
  mockDataForReduxStore
} from "../../../../../jest-utils/mocks";
import Counter from "../index";

// The Counter element in the editor canvas: the real class component, rendered
// in editor mode, counting on fake timers. The toolbar is replaced by a
// pass-through, since only the element's own render and lifecycle matter.
//
// The element waits a second after a mount or a change before it counts.

jest.mock("visual/component/Toolbar", () => ({
  __esModule: true,
  default: ({
    children
  }: {
    children: (props: { ref: () => void }) => unknown;
  }): unknown => children({ ref: () => undefined }),
  hideToolbar: (): void => undefined,
  showLastHiddenToolbar: (): void => undefined
}));

const store = createStore();

store.dispatch({
  ...hydrate({ ...mockDataForReduxStore, symbols: [] }),
  type: "HYDRATE"
});

function makeProps(
  dbValue: Model<ElementModel>
): EditorComponentProps<ElementModel, Record<string, unknown>> {
  return {
    _id: "counter-under-test",
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
    renderContext: "editor",
    editorMode: Mode.page,
    getGlobalConfig: () => mockConfig
  };
}

const element = (dbValue: Model<ElementModel>): React.ReactElement =>
  React.createElement(Provider, {
    store,
    children: React.createElement(StyleProvider, {
      children: React.createElement(Counter, makeProps(dbValue))
    })
  });

const value = (patch: Model<ElementModel>): Model<ElementModel> => ({
  type: "simple",
  start: 0,
  end: 100,
  duration: 2,
  separator: ",",
  ...patch
});

type Step =
  | { kind: "advance"; ms: number }
  | { kind: "rerender"; value: Model<ElementModel> };

const advance = (ms: number): Step => ({ kind: "advance", ms });

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.advanceTimersByTime(60_000);
  jest.useRealTimers();
  Reflect.deleteProperty(window, "jQuery");
});

describe("Counter in the editor canvas", () => {
  it.each<{
    case: string;
    mount: Model<ElementModel>;
    fxOff: boolean;
    steps: Step[];
    out: string[];
  }>([
    {
      case: "counts a second after mount",
      mount: value({}),
      fxOff: false,
      steps: [
        advance(999),
        advance(1),
        advance(500),
        advance(500),
        advance(500),
        advance(516)
      ],
      out: ["0", "0", "0", "24", "49", "74", "100"]
    },
    {
      case: "groups the thousands with the separator",
      mount: value({ end: 20000, duration: 1 }),
      fxOff: false,
      steps: [advance(1000), advance(500), advance(516)],
      out: ["0", "0", "9,440", "20,000"]
    },
    {
      case: "counts down",
      mount: value({ start: 50, end: 10, duration: 1 }),
      fxOff: false,
      steps: [advance(1000), advance(500), advance(516)],
      out: ["0", "50", "31", "10"]
    },
    {
      case: "counts past 100 for a plain figure",
      mount: value({ end: 150, duration: 1 }),
      fxOff: false,
      steps: [advance(1000), advance(1016)],
      out: ["0", "0", "150"]
    },
    {
      case: "stops a chart figure at 100",
      mount: value({ type: "radial", end: 150, duration: 1 }),
      fxOff: false,
      steps: [advance(1000), advance(1016)],
      out: ["0", "0", "100"]
    },
    {
      case: "stops a chart figure at 0",
      mount: value({ type: "pie", start: 50, end: -20, duration: 1 }),
      fxOff: false,
      steps: [advance(1000), advance(1016)],
      out: ["0", "50", "0"]
    },
    {
      case: "shows the end at once for a zero duration",
      mount: value({ end: 42, duration: 0 }),
      fxOff: false,
      steps: [advance(999), advance(1)],
      out: ["0", "0", "42"]
    },
    {
      case: "counts again from the start after a finished count",
      mount: value({ duration: 1 }),
      fxOff: false,
      steps: [
        advance(1000),
        advance(1016),
        { kind: "rerender", value: value({ duration: 1, end: 50 }) },
        advance(999),
        advance(1),
        advance(1016)
      ],
      out: ["0", "0", "100", "100", "100", "0", "50"]
    },
    {
      case: "finishes a running count before it counts again",
      mount: value({}),
      fxOff: false,
      steps: [
        advance(1000),
        advance(500),
        { kind: "rerender", value: value({ end: 200 }) },
        advance(999),
        advance(1),
        advance(16),
        advance(1000),
        advance(1016)
      ],
      out: ["0", "0", "24", "24", "74", "100", "0", "99", "200"]
    },
    {
      case: "keeps counting when only the separator changes",
      mount: value({ end: 20000 }),
      fxOff: false,
      steps: [
        advance(1000),
        advance(500),
        { kind: "rerender", value: value({ end: 20000, separator: "." }) },
        advance(1516)
      ],
      out: ["0", "0", "4,720", "4.720", "20.000"]
    },
    {
      case: "jumps to the end when the page's jQuery has effects off",
      mount: value({}),
      fxOff: true,
      steps: [advance(999), advance(1)],
      out: ["0", "0", "100"]
    }
  ])("$case", ({ mount, fxOff, steps, out }) => {
    if (fxOff) {
      Object.defineProperty(window, "jQuery", {
        configurable: true,
        writable: true,
        value: { fx: { off: true } }
      });
    }

    const { container, rerender, unmount } = renderWithProviders(
      element(mount)
    );
    const figure = (): string =>
      container.querySelector(".brz-counter-numbers")?.textContent ?? "";

    const figures = [figure()];
    for (const step of steps) {
      switch (step.kind) {
        case "advance":
          act(() => {
            jest.advanceTimersByTime(step.ms);
          });
          break;
        case "rerender":
          rerender(element(step.value));
          break;
      }
      figures.push(figure());
    }
    unmount();

    expect(figures).toEqual(out);
  });
});
