import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { ConfigContext } from "visual/providers/ConfigProvider/context";
import HotKeys from "../index";

// the shortcuts Column/Items registers for every element of a column
const elementShortcuts = [
  "duplicate",
  "copy",
  "paste",
  "pasteStyles",
  "delete",
  "horizontalAlign",
  "showSidebarStyling",
  "showSidebarAdvanced"
];

const key = {
  ctrl: 17,
  shift: 16,
  esc: 27,
  right: 39,
  C: 67,
  V: 86,
  D: 68,
  K: 75,
  M: 77,
  del: 46
};

const adminConfig = {};
const viewerConfig = { user: { role: "viewer" } };

const button = { type: "Button", value: { _id: "button-1" } };
const wrapperButton = {
  type: "Wrapper",
  value: { _id: "wrapper-button", items: [button] }
};

// an element dropped inside a mega menu: it is stored in the Menu's symbols
const megaMenuWrapper = {
  type: "Wrapper",
  value: {
    _id: "mega-wrapper",
    items: [{ type: "Button", value: { _id: "mega-button" } }]
  }
};
const menu = {
  type: "Menu",
  value: {
    _id: "menu-1",
    menuSelected: "menu-a",
    symbols: {
      "config-item-1": {
        megaMenuItems: [
          {
            type: "SectionMegaMenu",
            value: { _id: "mega-1", items: [megaMenuWrapper] }
          }
        ]
      }
    }
  }
};
const wrapperMenu = {
  type: "Wrapper",
  value: { _id: "wrapper-menu", items: [menu] }
};
const cloneableIcons = {
  type: "Cloneable",
  value: {
    _id: "cloneable-icons",
    items: [{ type: "Icon", value: { _id: "icon-1" } }]
  }
};
const section = {
  type: "Section",
  value: {
    _id: "section-1",
    items: [
      {
        type: "SectionItem",
        value: {
          _id: "section-item-1",
          items: [
            {
              type: "Row",
              value: {
                _id: "row-1",
                items: [
                  {
                    type: "Column",
                    value: {
                      _id: "column-1",
                      items: [wrapperButton, wrapperMenu, cloneableIcons]
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    ]
  }
};

// menu items are not authored in the page, they come from the menuData slice
const menuData = [
  {
    id: "menu-a",
    name: "Main",
    items: [
      {
        type: "MenuItem",
        value: { id: "config-item-1", title: "Home", url: "#", items: [] }
      }
    ]
  }
];

const emptyClipboard = { value: { items: [] }, path: [] };

// a Cloneable holding a Button, copied from elsewhere on the page
const copiedCloneableWithButton = {
  value: {
    items: [
      {
        type: "Cloneable",
        value: {
          _id: "copied-cloneable",
          items: [{ type: "Button", value: { _id: "copied-button" } }]
        }
      }
    ]
  },
  path: ["items", 0, "value", "items", 0, "value"]
};

const buildState = (copiedElement) => ({
  page: { data: { items: [] } },
  blocksOrder: ["section-1"],
  blocksData: { "section-1": section },
  globalBlocks: {},
  menuData,
  copiedElement
});

// what an element answers when a shortcut asks which element it should act on:
// its own id, unless it is built at runtime and points at its owner instead
const activeElement = (id) => ({
  getId: () => id,
  getHotKeysTargetId: () => id
});
const activeMenuItem = (runtimeId, menuElementId) => ({
  getId: () => runtimeId,
  getHotKeysTargetId: () => menuElementId
});

let mounted = [];

// Each registration gets its own root, and afterEach unmounts them in reverse
// order: HotKeysPlugin attaches its document listeners from the first instance
// mounted and detaches them from the last one unmounted, so only that order
// leaves the document clean for the next test.
const renderHotKeys = ({ state, config, registrations }) => {
  const store = createStore(() => state);

  mounted = registrations.map((registration) =>
    render(
      <Provider store={store}>
        <ConfigContext.Provider value={{ getConfig: () => config }}>
          <HotKeys {...registration}>
            <div />
          </HotKeys>
        </ConfigContext.Provider>
      </Provider>
    )
  );
};

const press = (keys, target) => {
  const node = target ?? document.body;

  // HotKeysPlugin remembers the keys currently held at module level and stops
  // updating them when a handler throws, so every press starts from a clean
  // slate the same way the editor does when the window regains focus
  window.dispatchEvent(new Event("blur"));

  const held = (keyCode) => ({
    keyCode,
    ctrlKey: keys.includes(key.ctrl),
    shiftKey: keys.includes(key.shift),
    key: "x"
  });

  for (const keyCode of keys) {
    fireEvent.keyDown(node, held(keyCode));
  }
  for (const keyCode of [...keys].reverse()) {
    fireEvent.keyUp(node, held(keyCode));
  }
};

const handledBy = (spy) => spy.mock.calls.map(([, item]) => item);

const targetIn = (attributes) => () => {
  const node = document.createElement("div");

  for (const [name, value] of Object.entries(attributes)) {
    node.setAttribute(name, value);
  }
  document.body.appendChild(node);

  return node;
};

describe("HotKeys", () => {
  afterEach(() => {
    // while the components are still mounted, so the listener is still there
    window.dispatchEvent(new Event("blur"));

    for (const { unmount } of [...mounted].reverse()) {
      unmount();
    }
    mounted = [];
    global.Brizy = { activeEditorComponent: null };
    document.body.innerHTML = "";
  });

  describe("routes a shortcut to the element it belongs to", () => {
    it.each([
      { case: "copy", keys: [key.ctrl, key.C], keyName: "ctrl+C" },
      { case: "paste", keys: [key.ctrl, key.V], keyName: "ctrl+V" },
      { case: "duplicate", keys: [key.ctrl, key.D], keyName: "ctrl+D" },
      { case: "delete", keys: [key.ctrl, key.del], keyName: "ctrl+del" },
      { case: "styling sidebar", keys: [key.ctrl, key.M], keyName: "ctrl+M" },
      { case: "advanced sidebar", keys: [key.ctrl, key.K], keyName: "ctrl+K" },
      {
        case: "horizontal align",
        keys: [key.ctrl, key.right],
        keyName: "ctrl+right"
      },
      {
        case: "paste styles",
        keys: [key.ctrl, key.shift, key.V],
        keyName: "ctrl+shift+V"
      }
    ])("hands $case to the wrapper that holds it", ({ keys, keyName }) => {
      const onWrapper = jest.fn();

      global.Brizy = { activeEditorComponent: activeElement("button-1") };
      renderHotKeys({
        state: buildState(emptyClipboard),
        config: adminConfig,
        registrations: [
          {
            id: "wrapper-button",
            shortcutsTypes: elementShortcuts,
            onKeyDown: onWrapper
          }
        ]
      });

      press(keys);

      expect(handledBy(onWrapper)).toEqual([
        expect.objectContaining({ id: "wrapper-button", keyName })
      ]);
    });

    it("hands it to the closest registered ancestor, not the outer one", () => {
      const onWrapper = jest.fn();
      const onColumn = jest.fn();

      global.Brizy = { activeEditorComponent: activeElement("button-1") };
      renderHotKeys({
        state: buildState(emptyClipboard),
        config: adminConfig,
        registrations: [
          {
            id: "column-1",
            shortcutsTypes: elementShortcuts,
            onKeyDown: onColumn
          },
          {
            id: "wrapper-button",
            shortcutsTypes: elementShortcuts,
            onKeyDown: onWrapper
          }
        ]
      });

      press([key.ctrl, key.C]);

      expect(handledBy(onWrapper)).toEqual([
        expect.objectContaining({ id: "wrapper-button" })
      ]);
      expect(onColumn).not.toHaveBeenCalled();
    });

    it("hands an element of a mega menu to its own wrapper", () => {
      const onMegaWrapper = jest.fn();
      const onMenuWrapper = jest.fn();

      global.Brizy = { activeEditorComponent: activeElement("mega-button") };
      renderHotKeys({
        state: buildState(emptyClipboard),
        config: adminConfig,
        registrations: [
          {
            id: "wrapper-menu",
            shortcutsTypes: elementShortcuts,
            onKeyDown: onMenuWrapper
          },
          {
            id: "mega-wrapper",
            shortcutsTypes: elementShortcuts,
            onKeyDown: onMegaWrapper
          }
        ]
      });

      press([key.ctrl, key.C]);

      expect(handledBy(onMegaWrapper)).toEqual([
        expect.objectContaining({ id: "mega-wrapper" })
      ]);
      expect(onMenuWrapper).not.toHaveBeenCalled();
    });

    it("calls the key up handler when the shortcut is released", () => {
      const onKeyUp = jest.fn();

      global.Brizy = { activeEditorComponent: activeElement("button-1") };
      renderHotKeys({
        state: buildState(emptyClipboard),
        config: adminConfig,
        registrations: [
          {
            id: "wrapper-button",
            shortcutsTypes: elementShortcuts,
            onKeyUp
          }
        ]
      });

      press([key.ctrl, key.C]);

      expect(handledBy(onKeyUp)).toEqual([
        expect.objectContaining({ id: "wrapper-button", keyName: "ctrl+C" })
      ]);
    });

    it("registers the keys passed by name next to the shortcut types", () => {
      const onKeyDown = jest.fn();

      global.Brizy = { activeEditorComponent: activeElement("button-1") };
      renderHotKeys({
        state: buildState(emptyClipboard),
        config: adminConfig,
        registrations: [
          {
            id: "wrapper-button",
            shortcutsTypes: ["copy"],
            keyNames: ["esc"],
            onKeyDown
          }
        ]
      });

      press([key.esc]);

      expect(handledBy(onKeyDown)).toEqual([
        expect.objectContaining({ id: "wrapper-button", keyName: "esc" })
      ]);
    });
  });

  describe("nothing is handled", () => {
    it.each([
      {
        case: "no element is active",
        active: null,
        config: adminConfig,
        shortcutsTypes: elementShortcuts,
        registered: "wrapper-button",
        target: () => document.body
      },
      {
        case: "the active element is unknown to the page",
        active: activeElement("not-on-this-page"),
        config: adminConfig,
        shortcutsTypes: elementShortcuts,
        registered: "wrapper-button",
        target: () => document.body
      },
      {
        case: "the registered element is not an ancestor of the active one",
        active: activeElement("button-1"),
        config: adminConfig,
        shortcutsTypes: elementShortcuts,
        registered: "wrapper-menu",
        target: () => document.body
      },
      {
        case: "the element did not register that shortcut",
        active: activeElement("button-1"),
        config: adminConfig,
        shortcutsTypes: ["duplicate"],
        registered: "wrapper-button",
        target: () => document.body
      },
      {
        case: "the user is not an admin",
        active: activeElement("button-1"),
        config: viewerConfig,
        shortcutsTypes: elementShortcuts,
        registered: "wrapper-button",
        target: () => document.body
      },
      {
        case: "the key was pressed inside an editable text",
        active: activeElement("button-1"),
        config: adminConfig,
        shortcutsTypes: elementShortcuts,
        registered: "wrapper-button",
        target: targetIn({ contenteditable: "true" })
      },
      {
        case: "the key was pressed inside an input",
        active: activeElement("button-1"),
        config: adminConfig,
        shortcutsTypes: elementShortcuts,
        registered: "wrapper-button",
        target: () => {
          const node = document.createElement("input");

          document.body.appendChild(node);

          return node;
        }
      },
      {
        case: "the key was pressed inside the toolbar portal",
        active: activeElement("button-1"),
        config: adminConfig,
        shortcutsTypes: elementShortcuts,
        registered: "wrapper-button",
        target: targetIn({ id: "brz-toolbar-portal" })
      },
      {
        case: "the key was pressed inside the right sidebar",
        active: activeElement("button-1"),
        config: adminConfig,
        shortcutsTypes: elementShortcuts,
        registered: "wrapper-button",
        target: targetIn({ class: "brz-ed-sidebar__right" })
      },
      {
        case: "the key was pressed inside the eye dropper",
        active: activeElement("button-1"),
        config: adminConfig,
        shortcutsTypes: elementShortcuts,
        registered: "wrapper-button",
        target: targetIn({ class: "brz-ed-eyeDropper" })
      }
    ])(
      "when $case",
      ({ active, config, shortcutsTypes, registered, target }) => {
        const onKeyDown = jest.fn();

        global.Brizy = { activeEditorComponent: active };
        renderHotKeys({
          state: buildState(emptyClipboard),
          config,
          registrations: [{ id: registered, shortcutsTypes, onKeyDown }]
        });

        press([key.ctrl, key.C], target());

        expect(onKeyDown).not.toHaveBeenCalled();
      }
    );

    it("still duplicates from inside an editable text", () => {
      const onKeyDown = jest.fn();

      global.Brizy = { activeEditorComponent: activeElement("button-1") };
      renderHotKeys({
        state: buildState(emptyClipboard),
        config: adminConfig,
        registrations: [
          {
            id: "wrapper-button",
            shortcutsTypes: elementShortcuts,
            onKeyDown
          }
        ]
      });

      press([key.ctrl, key.D], targetIn({ contenteditable: "true" })());

      expect(handledBy(onKeyDown)).toEqual([
        expect.objectContaining({ id: "wrapper-button", keyName: "ctrl+D" })
      ]);
    });
  });

  describe("the shortcuts of the editor chrome", () => {
    it("runs them without looking the active element up in the page", () => {
      const onKeyDown = jest.fn();

      global.Brizy = { activeEditorComponent: null };
      renderHotKeys({
        state: buildState(emptyClipboard),
        config: adminConfig,
        registrations: [
          { id: "key-helper-prompt-esc", keyNames: ["esc"], onKeyDown }
        ]
      });

      press([key.esc]);

      expect(handledBy(onKeyDown)).toEqual([
        expect.objectContaining({ id: "key-helper-prompt-esc" })
      ]);
    });

    it("lets the open toolbar swallow escape", () => {
      const onToolbar = jest.fn();
      const onPrompt = jest.fn();

      global.Brizy = { activeEditorComponent: null };
      renderHotKeys({
        state: buildState(emptyClipboard),
        config: adminConfig,
        registrations: [
          {
            id: "key-helper-prompt-esc",
            keyNames: ["esc"],
            onKeyDown: onPrompt
          },
          {
            id: "key-helper-toolbar-escape",
            keyNames: ["esc"],
            onKeyDown: onToolbar
          }
        ]
      });

      press([key.esc]);

      expect(handledBy(onToolbar)).toEqual([
        expect.objectContaining({ id: "key-helper-toolbar-escape" })
      ]);
      expect(onPrompt).not.toHaveBeenCalled();
    });
  });

  describe("pasting a Cloneable over an element of another type", () => {
    it("hands the paste to the container that would receive it", () => {
      const onCloneable = jest.fn();
      const onColumn = jest.fn();

      global.Brizy = { activeEditorComponent: activeElement("icon-1") };
      renderHotKeys({
        state: buildState(copiedCloneableWithButton),
        config: adminConfig,
        registrations: [
          {
            id: "column-1",
            shortcutsTypes: elementShortcuts,
            onKeyDown: onColumn
          },
          {
            id: "cloneable-icons",
            shortcutsTypes: elementShortcuts,
            onKeyDown: onCloneable
          }
        ]
      });

      press([key.ctrl, key.V]);

      expect(handledBy(onCloneable)).toEqual([
        expect.objectContaining({ id: "cloneable-icons", keyName: "ctrl+V" })
      ]);
      expect(onColumn).not.toHaveBeenCalled();
    });

    it("drops the paste when that container has no handler", () => {
      const onColumn = jest.fn();

      global.Brizy = { activeEditorComponent: activeElement("icon-1") };
      renderHotKeys({
        state: buildState(copiedCloneableWithButton),
        config: adminConfig,
        registrations: [
          {
            id: "column-1",
            shortcutsTypes: elementShortcuts,
            onKeyDown: onColumn
          }
        ]
      });

      press([key.ctrl, key.V]);

      expect(onColumn).not.toHaveBeenCalled();
    });
  });

  // BRZ-1407: a menu item is built from the menuData slice, so its _id is
  // generated at runtime and is nowhere in the page model
  describe("a menu item, whose id exists only at runtime", () => {
    it.each([
      { case: "copy", keys: [key.ctrl, key.C], keyName: "ctrl+C" },
      { case: "paste", keys: [key.ctrl, key.V], keyName: "ctrl+V" }
    ])("hands $case to the wrapper of its Menu", ({ keys, keyName }) => {
      const onMenuWrapper = jest.fn();

      global.Brizy = {
        activeEditorComponent: activeMenuItem("yk0LybaOXUbz", "menu-1")
      };
      renderHotKeys({
        state: buildState(emptyClipboard),
        config: adminConfig,
        registrations: [
          {
            id: "wrapper-menu",
            shortcutsTypes: elementShortcuts,
            onKeyDown: onMenuWrapper
          }
        ]
      });

      press(keys);

      expect(handledBy(onMenuWrapper)).toEqual([
        expect.objectContaining({ id: "wrapper-menu", keyName })
      ]);
    });

    it("resolves a paste without throwing", () => {
      const onError = jest.fn();

      window.addEventListener("error", onError);
      global.Brizy = {
        activeEditorComponent: activeMenuItem("yk0LybaOXUbz", "menu-1")
      };
      renderHotKeys({
        state: buildState(emptyClipboard),
        config: adminConfig,
        registrations: [
          {
            id: "wrapper-menu",
            shortcutsTypes: elementShortcuts,
            onKeyDown: jest.fn()
          }
        ]
      });

      press([key.ctrl, key.V]);
      window.removeEventListener("error", onError);

      expect(onError).not.toHaveBeenCalled();
    });
  });
});
