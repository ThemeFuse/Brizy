import { noop } from "es-toolkit";
import React from "react";
import { Provider } from "react-redux";
import { act, renderWithProviders } from "test-utils";
import { z } from "zod";
import type { ElementModel } from "visual/component/Elements/Types";
import type { Props as EditorComponentProps } from "visual/editorComponents/EditorComponent";
import type { Model } from "visual/editorComponents/EditorComponent/types";
import { Mode } from "visual/global/Config/types/configs/ConfigCommon";
import { I18nextProvider } from "visual/providers/I18nProvider";
import { StyleProvider } from "visual/providers/StyleProvider";
import { hydrate } from "visual/redux/actions";
import { createStore } from "visual/redux/store";
import {
  config as mockConfig,
  mockDataForReduxStore
} from "../../../../../jest-utils/mocks";
import Countdown2 from "../index";

// The Countdown2 element in the editor canvas: the real class component,
// rendered in editor mode, ticking on fake timers. The toolbar is replaced by
// a pass-through, since only the element's own render and lifecycle matter.
//
// Each tick writes the numbers through `innerText`, which jsdom does not
// implement: the written value stays on the node as a plain property and is
// read back as such.
//
// The stored end is 15/01/2026 10:30 in the visitor's timezone, which the
// element turns into Date.UTC(2026, 0, 15, 10, 30); every instant here is in
// January, where no timezone changes its offset.

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

const PARTS = ["days", "hours", "minutes", "seconds"] as const;

const SECOND = 1000;

// A day, an hour and thirty minutes before the end.
const MOUNTED_AT = Date.UTC(2026, 0, 14, 9, 0);

const writtenSchema = z.union([z.string(), z.number(), z.undefined()]);

const store = createStore();

store.dispatch({
  ...hydrate({ ...mockDataForReduxStore, symbols: [] }),
  type: "HYDRATE"
});

function makeProps(
  dbValue: Model<ElementModel>
): EditorComponentProps<ElementModel, Record<string, unknown>> {
  return {
    _id: "countdown2-under-test",
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

// The inline label editor reads translations and the wrapper writes CSS, so
// the element sits inside the providers it has on a real canvas.
const element = (dbValue: Model<ElementModel>): React.ReactElement =>
  React.createElement(Provider, {
    store,
    children: React.createElement(StyleProvider, {
      children: React.createElement(I18nextProvider, {
        children: React.createElement(Countdown2, makeProps(dbValue))
      })
    })
  });

const value = (patch: Model<ElementModel>): Model<ElementModel> => ({
  date: "15/01/2026",
  hours: "10 am",
  minutes: 30,
  timeZone: 0,
  ...patch
});

type Written = string | number | undefined;

interface Snapshot {
  numbers: (Written | "absent")[];
  timers: number;
}

type Step =
  | { kind: "advance"; ms: number }
  | { kind: "rerender"; value: Model<ElementModel> };

beforeEach(() => {
  jest.useFakeTimers({ now: MOUNTED_AT });
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe("Countdown2 in the editor canvas", () => {
  it.each<{
    case: string;
    mount: Model<ElementModel>;
    steps: Step[];
    out: Snapshot[];
  }>([
    {
      case: "writes the time left on mount, days unpadded",
      mount: value({}),
      steps: [],
      out: [{ numbers: [1, "01", "30", "00"], timers: 1 }]
    },
    {
      case: "ticks every second",
      mount: value({}),
      steps: [{ kind: "advance", ms: SECOND }],
      out: [
        { numbers: [1, "01", "30", "00"], timers: 1 },
        { numbers: [1, "01", "29", "59"], timers: 1 }
      ]
    },
    {
      case: "follows a new date",
      mount: value({}),
      steps: [{ kind: "rerender", value: value({ date: "16/01/2026" }) }],
      out: [
        { numbers: [1, "01", "30", "00"], timers: 1 },
        { numbers: [2, "01", "30", "00"], timers: 1 }
      ]
    },
    {
      // Existing quirk: the update takes a fresh `now` but keeps the first
      // start time, so the time elapsed before the change counts twice.
      case: "counts the elapsed time twice after a later date change (existing drift)",
      mount: value({}),
      steps: [
        { kind: "advance", ms: 5 * SECOND },
        { kind: "rerender", value: value({ date: "16/01/2026" }) }
      ],
      out: [
        { numbers: [1, "01", "30", "00"], timers: 1 },
        { numbers: [1, "01", "29", "55"], timers: 1 },
        { numbers: [2, "01", "29", "50"], timers: 1 }
      ]
    },
    {
      case: "skips the units it does not show",
      mount: value({ showDays: "off" }),
      steps: [{ kind: "advance", ms: SECOND }],
      out: [
        { numbers: ["absent", "01", "30", "00"], timers: 1 },
        { numbers: ["absent", "01", "29", "59"], timers: 1 }
      ]
    },
    {
      case: "stops at a past date and starts again at a future one",
      mount: value({ date: "13/01/2026" }),
      steps: [{ kind: "rerender", value: value({ date: "16/01/2026" }) }],
      out: [
        { numbers: [0, "00", "00", "00"], timers: 0 },
        { numbers: [2, "01", "30", "00"], timers: 1 }
      ]
    }
  ])("$case", ({ mount, steps, out }) => {
    const baseline = jest.getTimerCount();
    const { container, rerender, unmount } = renderWithProviders(
      element(mount)
    );
    const snapshot = (): Snapshot => ({
      numbers: PARTS.map((part) => {
        const node = container.querySelector(
          `.brz-countdown2__${part} > .brz-countdown2__number`
        );
        return node
          ? writtenSchema.parse(Reflect.get(node, "innerText"))
          : "absent";
      }),
      timers: jest.getTimerCount() - baseline
    });

    const snapshots = [snapshot()];
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
      snapshots.push(snapshot());
    }
    unmount();

    expect(snapshots).toEqual(out);
  });

  // A timer left running after unmount would write into refs that are gone
  // and throw on the next tick.
  it("stops its timer when it unmounts", () => {
    const baseline = jest.getTimerCount();
    const { unmount } = renderWithProviders(element(value({})));
    const mounted = jest.getTimerCount() - baseline;

    unmount();
    const unmounted = jest.getTimerCount() - baseline;

    expect({ mounted, unmounted }).toEqual({ mounted: 1, unmounted: 0 });
    expect(() => jest.advanceTimersByTime(5 * SECOND)).not.toThrow();
  });
});
