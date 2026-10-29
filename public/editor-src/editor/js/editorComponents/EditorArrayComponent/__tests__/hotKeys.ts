import { act } from "@testing-library/react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import {
  container,
  type Item,
  itemA,
  itemB,
  maskNewIds,
  mountArrayComponent,
  NEW_ID,
  STORY_WRAPPER
} from "../../../../../jest-utils/arrayComponent";

// `handleKeyDown` is what the HotKeys wrapper of every item calls with the
// shortcut name and the id of the item it wraps.

const addColumn = jest.fn();

class Columns extends EditorArrayComponent {
  static get componentId(): string {
    return "TestColumns";
  }

  addColumn(index: number): void {
    addColumn(index);
  }
}

const a1 = itemA("a1", {
  text: "one",
  color: "blue",
  horizontalAlign: "left",
  verticalAlign: "top"
});
const a2 = itemA("a2", { text: "two" });
const b1 = itemB("b1", { label: "three" });
const flat = [a1, a2, b1];

const story = (id: string, inner: Item["value"]): Item =>
  container(STORY_WRAPPER, id, {}, [itemA(`${id}-inner`, inner)]);
const newStory = (inner: Item["value"]): Item =>
  container(STORY_WRAPPER, NEW_ID, {}, [itemA(NEW_ID, inner)]);

const s1 = story("s1", { text: "one", offsetX: 10, offsetY: 20 });
const s2 = story("s2", { text: "two", offsetX: 30, offsetY: 40 });
const s3 = story("s3", { text: "three" });
const stories = [s1, s2, s3];

const known = [
  "a1",
  "a2",
  "b1",
  "s1",
  "s2",
  "s3",
  "s1-inner",
  "s2-inner",
  "s3-inner"
];

const pathOf = (index: number): string[] => [
  "items",
  "0",
  "value",
  "items",
  String(index)
];

interface Result {
  change: unknown[];
  addColumn: unknown[];
  copied: string[];
  sidebar: { isOpen: boolean; activeTab: unknown };
}

interface Row {
  case: string;
  key: string;
  items: Item[];
  id: string;
  copy: number | undefined;
  out: Result;
}

const idle: Result = {
  change: [],
  addColumn: [],
  copied: [],
  sidebar: { isOpen: false, activeTab: undefined }
};

const rows = (
  keys: string[],
  row: { case: string; id: string; out: Partial<Result> }
): Row[] =>
  keys.map((key) => ({
    case: `${key} ${row.case}`,
    key,
    items: flat,
    id: row.id,
    copy: undefined,
    out: { ...idle, ...row.out }
  }));

const modifiers = (key: string): string[] =>
  ["ctrl", "cmd", "right_cmd"].map((modifier) => `${modifier}+${key}`);
const withAlt = (key: string): string[] => [`alt+${key}`, ...modifiers(key)];

const pasted = (keys: string[], row: { case: string; out: Item[] }): Row[] =>
  keys.map((key) => ({
    case: `${key} ${row.case}`,
    key,
    items: flat,
    id: "a2",
    copy: 0,
    out: {
      ...idle,
      copied: pathOf(0),
      change: [[row.out, { arrayOperation: "insert" }]]
    }
  }));

const styled: Item[] = [
  a1,
  itemA("a2", {
    text: "two",
    color: "blue",
    hoverColor: "pink",
    horizontalAlign: "left",
    verticalAlign: "top"
  }),
  b1
];

beforeAll(() => {
  Object.assign(performance, { mark: jest.fn(), measure: jest.fn() });
});

beforeEach(() => {
  addColumn.mockClear();
});

describe("EditorArrayComponent shortcuts", () => {
  it.each<Row>([
    ...rows(withAlt("N"), {
      case: "adds a column after the item",
      id: "a2",
      out: { addColumn: [[2]] }
    }),
    ...rows(modifiers("M"), {
      case: "opens the styles tab of the sidebar",
      id: "a2",
      out: { sidebar: { isOpen: true, activeTab: "styles" } }
    }),
    ...rows(modifiers("K"), {
      case: "opens the effects tab of the sidebar",
      id: "a2",
      out: { sidebar: { isOpen: true, activeTab: "effects" } }
    }),
    ...rows(withAlt("D"), {
      case: "duplicates the item",
      id: "a2",
      out: {
        change: [
          [
            [a1, a2, itemA(NEW_ID, { text: "two" }), b1],
            { arrayOperation: "insert" }
          ]
        ]
      }
    }),
    ...rows(withAlt("C"), {
      case: "copies the item",
      id: "a2",
      out: { copied: pathOf(1) }
    }),
    ...pasted(withAlt("V"), {
      case: "pastes the copied item after the item",
      out: [a1, a2, { type: a1.type, value: { ...a1.value, _id: NEW_ID } }, b1]
    }),
    ...[
      ...withAlt("shift+V"),
      "shift+alt+V",
      "shift+ctrl+V",
      "shift+cmd+V",
      "shift+right_cmd+V"
    ].map((key) => ({
      case: `${key} pastes the styles of the copied item`,
      key,
      items: flat,
      id: "a2",
      copy: 0,
      out: {
        ...idle,
        copied: pathOf(0),
        change: [[styled, { arrayOperation: "itemChange" }]]
      }
    })),
    ...rows(modifiers("right"), {
      case: "moves the horizontal alignment forward",
      id: "a1",
      out: {
        change: [
          [
            [itemA("a1", { ...a1.value, horizontalAlign: "center" }), a2, b1],
            { arrayOperation: "itemChange" }
          ]
        ]
      }
    }),
    ...rows(modifiers("left"), {
      case: "moves the horizontal alignment back, around the end",
      id: "a1",
      out: {
        change: [
          [
            [itemA("a1", { ...a1.value, horizontalAlign: "right" }), a2, b1],
            { arrayOperation: "itemChange" }
          ]
        ]
      }
    }),
    ...rows([...modifiers("down"), "alt+down"], {
      case: "moves the vertical alignment forward",
      id: "a1",
      out: {
        change: [
          [
            [itemA("a1", { ...a1.value, verticalAlign: "center" }), a2, b1],
            { arrayOperation: "itemChange" }
          ]
        ]
      }
    }),
    ...rows([...modifiers("up"), "alt+up"], {
      case: "moves the vertical alignment back, around the end",
      id: "a1",
      out: {
        change: [
          [
            [itemA("a1", { ...a1.value, verticalAlign: "bottom" }), a2, b1],
            { arrayOperation: "itemChange" }
          ]
        ]
      }
    }),
    ...rows(withAlt("del"), {
      case: "removes the item",
      id: "a2",
      out: { change: [[[a1, b1], { arrayOperation: "remove" }]] }
    }),
    ...rows(["ctrl+Q"], {
      case: "is not a shortcut of the list",
      id: "a2",
      out: {}
    }),
    {
      case: "ctrl+D duplicates a story element five pixels away",
      key: "ctrl+D",
      items: stories,
      id: "s1",
      copy: undefined,
      out: {
        ...idle,
        change: [
          [
            [s1, newStory({ text: "one", offsetX: 15, offsetY: 25 }), s2, s3],
            { arrayOperation: "insert" }
          ]
        ]
      }
    },
    {
      case: "ctrl+D duplicates a story element without offsets at five pixels",
      key: "ctrl+D",
      items: stories,
      id: "s3",
      copy: undefined,
      out: {
        ...idle,
        change: [
          [
            [s1, s2, s3, newStory({ text: "three", offsetX: 5, offsetY: 5 })],
            { arrayOperation: "insert" }
          ]
        ]
      }
    },
    {
      case: "ctrl+V pastes a story element five pixels from the target",
      key: "ctrl+V",
      items: stories,
      id: "s2",
      copy: 0,
      out: {
        ...idle,
        copied: pathOf(0),
        change: [
          [
            [s1, s2, newStory({ text: "one", offsetX: 35, offsetY: 45 }), s3],
            { arrayOperation: "insert" }
          ]
        ]
      }
    },
    {
      case: "ctrl+V pastes a story element at five pixels on a target without offsets",
      key: "ctrl+V",
      items: stories,
      id: "s3",
      copy: 0,
      out: {
        ...idle,
        copied: pathOf(0),
        change: [
          [
            [s1, s2, s3, newStory({ text: "one", offsetX: 5, offsetY: 5 })],
            { arrayOperation: "insert" }
          ]
        ]
      }
    }
  ])("$case", ({ key, items, id, copy, out }) => {
    const m = mountArrayComponent({
      items,
      defaultValue: undefined,
      props: {},
      Component: Columns
    });

    if (copy !== undefined) {
      m.instance.copy(copy);
    }

    global.Brizy = { activeEditorComponent: m.child(id).instance };

    const event = new KeyboardEvent("keydown", { cancelable: true });

    act(() => {
      m.instance.handleKeyDown(event, { keyName: key, id });
    });

    const { isOpen, activeTab } = m.store.getState().ui.rightSidebar;

    expect(event.defaultPrevented).toBe(true);
    expect({
      change: maskNewIds(m.onChange.mock.calls, known),
      addColumn: addColumn.mock.calls,
      copied: m.store.getState().copiedElement.path,
      sidebar: { isOpen, activeTab }
    }).toEqual(out);
  });

  it("alt+N fails on a list that cannot add columns", () => {
    const m = mountArrayComponent({
      items: flat,
      defaultValue: undefined,
      props: {},
      Component: EditorArrayComponent
    });

    expect(() =>
      m.instance.handleKeyDown(
        new KeyboardEvent("keydown", { cancelable: true }),
        { keyName: "alt+N", id: "a2" }
      )
    ).toThrow();
    expect(m.onChange).not.toHaveBeenCalled();
  });

  it("ctrl+V fails on a story element that holds nothing", () => {
    const empty = container(STORY_WRAPPER, "empty", {}, []);
    const m = mountArrayComponent({
      items: [s1, empty],
      defaultValue: undefined,
      props: {},
      Component: Columns
    });

    m.instance.copy(0);

    expect(() =>
      m.instance.handleKeyDown(
        new KeyboardEvent("keydown", { cancelable: true }),
        { keyName: "ctrl+V", id: "empty" }
      )
    ).toThrow("The story element has no content");
    expect(m.onChange).not.toHaveBeenCalled();
  });
});
