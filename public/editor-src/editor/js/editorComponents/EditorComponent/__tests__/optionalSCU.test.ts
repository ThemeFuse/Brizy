import { noop } from "es-toolkit";
import { ElementModel } from "visual/component/Elements/Types";
import {
  MenuData,
  MenuItem,
  Mode
} from "visual/global/Config/types/configs/ConfigCommon";
import { hydrate } from "visual/redux/actions";
import {
  addMenuData,
  removeMenuData,
  updateMenuData
} from "visual/redux/actions2";
import { createStore } from "visual/redux/store";
import { ReduxState } from "visual/redux/types";
import { mockDataForReduxStore } from "../../../../../jest-utils/mocks";
import { EditorComponent, Props } from "../index";

type ECProps = Props<ElementModel, Record<string, unknown>>;

const item = (id: string): MenuItem => ({
  type: "MenuItem",
  value: {
    id,
    title: id,
    url: `/${id}`,
    target: "",
    items: [],
    megaMenuItems: [],
    attrTitle: "",
    classes: [],
    liClasses: [],
    current: false,
    editorUrl: `/${id}`
  }
});

const menu = (id: string, items: string[]): MenuData => ({
  id,
  name: id,
  items: items.map(item)
});

/** A hydrated store with one menu, to prune/add/delete against. */
const seeded = () => {
  const store = createStore();

  // `hydrate` is untyped JS, so its `type` widens to `string`; restating it in
  // the dispatched literal keeps the action inside `ReduxAction`.
  store.dispatch({
    ...hydrate({ ...mockDataForReduxStore, symbols: [] }),
    type: "HYDRATE"
  });
  store.dispatch(addMenuData(menu("main", ["item-1", "item-2"])));

  return store;
};

const store = seeded();

// Everything except `reduxState` is shared between before and after, `dbValue`
// included — a menu lives in its own slice and moves no element model.
const dbValue = {};
const defaultValue = {};
const path: string[] = [];
const meta = {};

const props = (reduxState: ReduxState): ECProps => ({
  _id: "el1",
  dbValue,
  defaultValue,
  path,
  reduxStore: store,
  reduxState,
  reduxDispatch: store.dispatch,
  meta,
  onChange: noop,
  onToolbarOpen: noop,
  onToolbarClose: noop,
  onToolbarEnter: noop,
  onToolbarLeave: noop,
  extendParentToolbar: noop,
  renderContext: "editor",
  editorMode: Mode.page,
  // optionalSCU never reads the config; fail loudly if that ever changes.
  getGlobalConfig: () => {
    throw new Error("optionalSCU is not expected to read the global config");
  }
});

const elementAt = (reduxState: ReduxState): EditorComponent =>
  Object.assign(Object.create(EditorComponent.prototype), {
    props: props(reduxState)
  });

describe("EditorComponent.optionalSCU", () => {
  // None of these move a dbValue, so without the menuData check every
  // Wrapper/Row/Column above the element blocks the render.
  it.each([
    {
      case: "an item is pruned off a menu, the way deletePage prunes it",
      act: () => updateMenuData("main", [item("item-2")]),
      repaints: true
    },
    {
      case: "a menu is created",
      act: () => addMenuData(menu("footer", ["item-3"])),
      repaints: true
    },
    {
      case: "a menu is deleted",
      act: () => removeMenuData("main"),
      repaints: true
    },
    {
      // The reducer returns the same array when it changes nothing.
      case: "an action leaves the menus untouched",
      act: () => updateMenuData("no-such-menu", []),
      repaints: false
    }
  ])("repaints on $case: $repaints", ({ act, repaints }) => {
    const before = store.getState();
    store.dispatch(act());
    const after = store.getState();

    expect(elementAt(before).optionalSCU(props(after))).toBe(repaints);
  });
});
