import { act } from "@testing-library/react";
import { noop } from "es-toolkit";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import type {
  SidebarConfig,
  ToolbarExtend
} from "visual/editorComponents/EditorComponent/types";
import type {
  OptionDefinition,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { updateUI } from "visual/redux/actions2";
import { addFilter, removeFilter } from "visual/utils/filters";
import {
  ITEM_A_DEFAULT,
  type Item,
  itemA,
  itemB,
  type Mounted,
  mountArrayComponent
} from "../../../../../jest-utils/arrayComponent";

// `makeItemsToolbarPropsFromConfig2` builds the toolbar of one item of the
// list: the item's own options, extended by the parent, the child and third
// parties, unless the options turn an extension off.

class Columns extends EditorArrayComponent {
  static get componentId(): string {
    return "TestColumns";
  }
}

const a1 = itemA("a1", { text: "one", tabsState: "hover" });
const a2 = itemA("a2", { text: "two" });
const b1 = itemB("b1", { label: "three" });
const list = [a1, a2, b1];

const button = (id: string): OptionDefinition => ({
  id,
  type: "button",
  value: undefined,
  onChange: noop
});
const item = (id: string): ToolbarItemType => ({
  id,
  type: "button",
  onClick: noop
});
const extension = (name: string, title: string): ToolbarExtend => ({
  getItems: () => [button(`${name}Btn`)],
  getSidebarItems: () => [button(`${name}Side`)],
  getSidebarTitle: () => title
});

const thirdToolbar = () => ({ getItems: () => [button("thirdBtn")] });
const thirdSidebar = () => ({ getItems: () => [button("thirdSide")] });
const otherToolbar = () => ({ getItems: () => [button("otherBtn")] });
const otherSidebar = () => ({ getItems: () => [button("otherSide")] });

const filters: Array<[string, () => unknown]> = [
  ["toolbarItemsExtend_TestColumns", thirdToolbar],
  ["sidebarItemsExtend_TestColumns", thirdSidebar],
  ["toolbarItemsExtend_TestOther", otherToolbar],
  ["sidebarItemsExtend_TestOther", otherSidebar]
];

const callbacks = {
  onToolbarOpen: jest.fn(),
  onToolbarClose: jest.fn(),
  onToolbarEnter: jest.fn(),
  onToolbarLeave: jest.fn()
};

const mount = (props: Record<string, unknown>): Mounted => {
  const m = mountArrayComponent({
    items: list,
    defaultValue: undefined,
    props: {
      toolbarExtend: extension("parent", "Parent title"),
      otherExtend: extension("other", "Other title"),
      ...callbacks,
      ...props
    },
    Component: Columns
  });

  m.instance.childToolbarExtend = extension("child", "");

  return m;
};

const seen: Array<Record<string, unknown>> = [];
const own = {
  getItems: (params: Record<string, unknown>) => {
    seen.push(params);

    return [item("ownBtn")];
  }
};
const ownSidebar: SidebarConfig<Item["value"]> = {
  getItems: () => [item("ownSide")],
  title: ({ v }) => `Title ${v.text}`
};

const ids = (options: Array<{ id: string }>): string[] =>
  options.map((option) => option.id);

beforeAll(() => {
  for (const [name, cb] of filters) {
    addFilter(name, cb);
  }
});

afterAll(() => {
  for (const [name, cb] of filters) {
    removeFilter(name, cb);
  }
});

beforeEach(() => {
  seen.length = 0;
  global.Brizy = {};
});

describe("EditorArrayComponent item toolbar", () => {
  it.each<{
    case: string;
    options: Record<string, unknown>;
    items: string[];
    sidebarItems: string[];
    title: string;
  }>([
    {
      case: "is extended by the child, the parent and third parties",
      options: {},
      items: ["childBtn", "ownBtn", "parentBtn", "thirdBtn"],
      sidebarItems: ["childSide", "ownSide", "parentSide", "thirdSide"],
      title: "Parent title"
    },
    {
      case: "stays on its own with allowExtend off",
      options: { allowExtend: false },
      items: ["ownBtn"],
      sidebarItems: ["ownSide"],
      title: "Title one"
    },
    {
      case: "skips the parent with allowExtendFromParent off",
      options: { allowExtendFromParent: false },
      items: ["childBtn", "ownBtn", "thirdBtn"],
      sidebarItems: ["childSide", "ownSide", "thirdSide"],
      title: "Title one"
    },
    {
      case: "skips the child with allowExtendFromChild off",
      options: { allowExtendFromChild: false },
      items: ["ownBtn", "parentBtn", "thirdBtn"],
      sidebarItems: ["ownSide", "parentSide", "thirdSide"],
      title: "Parent title"
    },
    {
      case: "skips third parties with allowExtendFromThirdParty off",
      options: { allowExtendFromThirdParty: false },
      items: ["childBtn", "ownBtn", "parentBtn"],
      sidebarItems: ["childSide", "ownSide", "parentSide"],
      title: "Parent title"
    },
    {
      case: "keeps the toolbar extensions with only allowSidebarExtend off",
      options: { allowSidebarExtend: false },
      items: ["childBtn", "ownBtn", "parentBtn", "thirdBtn"],
      sidebarItems: ["ownSide"],
      title: "Title one"
    },
    {
      case: "filters the parent's toolbar options with parentItemsFilter",
      options: { parentItemsFilter: () => [button("filteredBtn")] },
      items: ["childBtn", "ownBtn", "filteredBtn", "thirdBtn"],
      sidebarItems: ["childSide", "ownSide", "parentSide", "thirdSide"],
      title: "Parent title"
    },
    {
      case: "reads the parent's options from the prop named by parentExtendProp",
      options: { parentExtendProp: "otherExtend" },
      items: ["childBtn", "ownBtn", "otherBtn", "thirdBtn"],
      sidebarItems: ["childSide", "ownSide", "otherSide", "thirdSide"],
      title: "Parent title"
    },
    {
      case: "takes third-party options under thirdPartyExtendId",
      options: { thirdPartyExtendId: "TestOther" },
      items: ["childBtn", "ownBtn", "parentBtn", "otherBtn"],
      sidebarItems: ["childSide", "ownSide", "parentSide", "otherSide"],
      title: "Parent title"
    },
    {
      case: "takes third-party sidebar options under sidebarThirdPartyExtendId",
      options: { sidebarThirdPartyExtendId: "TestOther" },
      items: ["childBtn", "ownBtn", "parentBtn", "thirdBtn"],
      sidebarItems: ["childSide", "ownSide", "parentSide", "otherSide"],
      title: "Parent title"
    }
  ])("$case", ({ options, items, sidebarItems, title }) => {
    const { instance } = mount({});
    const toolbar = instance.makeItemsToolbarPropsFromConfig2(own, ownSidebar, {
      itemIndex: 0,
      ...options
    });

    expect({
      items: ids(toolbar.getItems()),
      sidebarItems: ids(toolbar.getSidebarItems()),
      title: toolbar.getSidebarTitle()
    }).toEqual({ items, sidebarItems, title });
  });

  it.each<{
    case: string;
    sidebar: SidebarConfig<Item["value"]> | null;
    sidebarItems: string[];
    title: string;
  }>([
    {
      case: "a plain title",
      sidebar: { getItems: () => [item("ownSide")], title: "Plain" },
      sidebarItems: ["ownSide"],
      title: "Plain"
    },
    {
      case: "a title made from the item's value",
      sidebar: ownSidebar,
      sidebarItems: ["ownSide"],
      title: "Title two"
    },
    {
      case: "no title and no options without a sidebar config",
      sidebar: null,
      sidebarItems: [],
      title: ""
    }
  ])("the sidebar has $case", ({ sidebar, sidebarItems, title }) => {
    const { instance } = mount({});
    const toolbar = instance.makeItemsToolbarPropsFromConfig2(own, sidebar, {
      itemIndex: 1,
      allowExtend: false
    });

    expect({
      sidebarItems: ids(toolbar.getSidebarItems()),
      title: toolbar.getSidebarTitle()
    }).toEqual({ sidebarItems, title });
  });

  it.each<{
    case: string;
    itemIndex: number;
    storeDevice: "desktop" | "tablet" | "mobile";
    askedDevice: "desktop" | "tablet" | "mobile" | undefined;
    out: { v: Item["value"]; device: string; state: string };
  }>([
    {
      case: "the item's value with its defaults, the store's device and the item's state",
      itemIndex: 0,
      storeDevice: "tablet",
      askedDevice: undefined,
      out: {
        v: {
          ...ITEM_A_DEFAULT.style,
          ...ITEM_A_DEFAULT.content,
          ...a1.value
        },
        device: "tablet",
        state: "hover"
      }
    },
    {
      case: "the device it is asked for and the normal state by default",
      itemIndex: 1,
      storeDevice: "desktop",
      askedDevice: "mobile",
      out: {
        v: {
          ...ITEM_A_DEFAULT.style,
          ...ITEM_A_DEFAULT.content,
          ...a2.value
        },
        device: "mobile",
        state: "normal"
      }
    }
  ])("the item's options get $case", (row) => {
    const { instance, store } = mount({});
    const toolbar = instance.makeItemsToolbarPropsFromConfig2(own, ownSidebar, {
      itemIndex: row.itemIndex,
      allowExtend: false
    });

    act(() => {
      store.dispatch(updateUI("deviceMode", row.storeDevice));
    });
    toolbar.getItems(row.askedDevice);

    expect(seen).toEqual([
      {
        ...row.out,
        component: instance,
        context: instance.context
      }
    ]);
  });

  it("marks the list as the active component while the toolbar is open", () => {
    const { instance } = mount({});
    const toolbar = instance.makeItemsToolbarPropsFromConfig2(own, ownSidebar, {
      itemIndex: 0
    });

    toolbar.onBeforeOpen?.();
    const whileOpen = global.Brizy.activeEditorComponent;
    toolbar.onBeforeClose?.();

    expect(whileOpen).toBe(instance);
    expect(global.Brizy.activeEditorComponent).toBeNull();
  });

  it("hands the list's toolbar callbacks to the item toolbar", () => {
    const { instance } = mount({});
    const toolbar = instance.makeItemsToolbarPropsFromConfig2(own, ownSidebar, {
      itemIndex: 0
    });

    expect({
      onOpen: toolbar.onOpen,
      onClose: toolbar.onClose,
      onMouseEnter: toolbar.onMouseEnter,
      onMouseLeave: toolbar.onMouseLeave
    }).toEqual({
      onOpen: callbacks.onToolbarOpen,
      onClose: callbacks.onToolbarClose,
      onMouseEnter: callbacks.onToolbarEnter,
      onMouseLeave: callbacks.onToolbarLeave
    });
  });

  it("needs the index of the item", () => {
    const { instance } = mount({});

    expect(() =>
      instance.makeItemsToolbarPropsFromConfig2(own, ownSidebar)
    ).toThrow("Missing itemIndex in options");
  });
});
