import { ElementModel } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { createStore } from "visual/redux/store";
import { DESKTOP } from "visual/utils/responsiveMode";
import { EditorComponent } from "../index";

jest.mock("visual/component/Options/types/dev/Typography/index.tsx", () => ({
  Typography: {}
}));

const toolbar = [
  {
    id: "spinItems",
    type: "addable",
    default: { value: [{ id: "s1", title: "Item 1" }] },
    shape: [{ id: "score", type: "number", default: { value: 81 } }]
  }
] as unknown as ToolbarItemType[];

// An element whose stored model we can swap, the way adding a group does.
const element = () => {
  const store = createStore();

  const ec = Object.create(EditorComponent.prototype) as EditorComponent;

  // `getDBValue` is not stubbed: it is half the memo's key, so the production
  // one has to be on the path — `tempPatch` included.
  Object.assign(ec, {
    componentConfig: { getConfig: () => [{ toolbar, sidebar: [] }] },
    props: { editorMode: "page", dbValue: {}, _id: "el1" },
    getDeviceMode: () => DESKTOP,
    getReduxStore: () => store
  });

  return {
    getDefaultValue: () => ec.getDefaultValue(),
    // A new props object, the way redux hands one down.
    setDBValue: (dbValue: ElementModel) =>
      Object.assign(ec, { props: { ...ec.props, dbValue } })
  };
};

describe("a group added at runtime", () => {
  test("gets the shape defaults after the stored value grows it", () => {
    const el = element();

    // First render: only the declared group exists.
    expect(el.getDefaultValue()).toMatchObject({ spinItemsS1Score: 81 });

    // The user clicks "Add New" — the model grows a group, nothing else.
    el.setDBValue({
      spinItems: [
        { id: "s1", title: "Item 1" },
        { id: "kf93la", title: "Item 2" }
      ]
    });

    expect(el.getDefaultValue()).toMatchObject({
      spinItemsS1Score: 81,
      spinItemsKf93laScore: 81
    });
  });
});
