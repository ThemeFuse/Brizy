import { render } from "@testing-library/react";
import React, { createRef, type ReactNode } from "react";
import type {
  ElementDefaultValue,
  ElementModel
} from "visual/component/Elements/Types";
import type EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Mode } from "visual/global/Config/types/configs/ConfigCommon";
import Editor from "visual/global/Editor";
import { hydrate } from "visual/redux/actions";
import { createStore, type Store } from "visual/redux/store";
import { config, mockDataForReduxStore } from "./mocks";

export type Item = { type: string; value: ElementModel };

export const PARENT_ID = "parent";
export const SECTION = "TestSection";
export const ITEM_A = "TestItemA";
export const ITEM_B = "TestItemB";
export const NOT_FOUND = "TestNotFound";
export const WRAPPER = "Wrapper";
export const CLONEABLE = "Cloneable";
export const STORY_WRAPPER = "StoryWrapper";
export const NEW_ID = "<new>";

export const ITEM_A_DEFAULT: ElementDefaultValue = {
  style: {
    color: "red",
    hoverColor: "pink",
    tabletColor: "orange",
    horizontalAlign: "center",
    tabletHorizontalAlign: "center",
    verticalAlign: "center"
  },
  content: {
    text: "default text"
  }
};

export const ITEM_B_DEFAULT: ElementDefaultValue = {
  style: {
    size: 10
  },
  content: {
    label: "default label"
  }
};

const CONTAINER_DEFAULT: ElementDefaultValue = {
  style: {
    showToolbar: "off"
  }
};

export type Rendered = {
  componentId: string;
  props: Record<string, unknown>;
  instance: EditorComponent;
};

let rendered: Rendered[] = [];

const makeItemComponent = (id: string, defaultValue: ElementDefaultValue) =>
  class extends EditorComponent {
    static get componentId(): string {
      return id;
    }

    static defaultValue = defaultValue;

    render(): ReactNode {
      rendered.push({ componentId: id, props: this.props, instance: this });

      return <div data-type={id} data-id={String(this.props.dbValue._id)} />;
    }
  };

Editor.registerComponent({
  id: ITEM_A,
  component: makeItemComponent(ITEM_A, ITEM_A_DEFAULT)
});
Editor.registerComponent({
  id: ITEM_B,
  component: makeItemComponent(ITEM_B, ITEM_B_DEFAULT)
});
Editor.registerNotFoundComponent(makeItemComponent(NOT_FOUND, {}));

for (const id of [WRAPPER, CLONEABLE, STORY_WRAPPER]) {
  Editor.registerComponent({
    id,
    component: makeItemComponent(id, CONTAINER_DEFAULT)
  });
}

export const itemA = (id: string, value: ElementModel): Item => ({
  type: ITEM_A,
  value: { _id: id, ...value }
});

export const itemB = (id: string, value: ElementModel): Item => ({
  type: ITEM_B,
  value: { _id: id, ...value }
});

export const container = (
  type: string,
  id: string,
  value: ElementModel,
  items: Item[]
): Item => ({ type, value: { _id: id, ...value, items } });

// ids are generated at random, so every id outside `known` is replaced by NEW_ID
export const maskNewIds = (value: unknown, known: string[]): unknown =>
  JSON.parse(
    JSON.stringify(value, (key, v) =>
      key === "_id" && !known.includes(v) ? NEW_ID : v
    )
  );

export interface Mounted {
  instance: EditorArrayComponent;
  onChange: jest.Mock;
  store: Store;
  container: HTMLElement;
  rendered: () => Rendered[];
  child: (id: string) => Rendered;
}

export interface MountOptions {
  items: Item[] | undefined;
  defaultValue: Item[] | undefined;
  props: Record<string, unknown>;
  Component: typeof EditorArrayComponent;
}

// The component under test is the `items` list of the page block PARENT_ID
export function mountArrayComponent(options: MountOptions): Mounted {
  const { items, defaultValue, props, Component } = options;

  rendered = [];

  const store = createStore();

  store.dispatch({
    ...hydrate({
      ...mockDataForReduxStore,
      symbols: [],
      page: {
        data: {
          items: [
            { type: SECTION, value: { _id: PARENT_ID, items: items ?? [] } }
          ]
        }
      }
    }),
    type: "HYDRATE"
  });

  const onChange = jest.fn();
  const ref = createRef<EditorArrayComponent>();

  const { container } = render(
    <Component
      ref={ref}
      _id={`${PARENT_ID}-items`}
      // @ts-expect-error the stored value of an array component is a list
      dbValue={items}
      // @ts-expect-error the default value of an array component is a list
      defaultValue={defaultValue}
      reduxState={store.getState()}
      reduxStore={store}
      reduxDispatch={store.dispatch}
      onChange={onChange}
      renderContext="editor"
      editorMode={Mode.page}
      getGlobalConfig={() => config}
      {...props}
    />
  );

  if (!ref.current) {
    throw new Error("The array component did not mount");
  }

  return {
    instance: ref.current,
    onChange,
    store,
    container,
    rendered: () => rendered,
    child: (id) => {
      const found = rendered.find((r) => Reflect.get(r.props, "_id") === id);
      const byValue = rendered.find(
        (r) => Reflect.get(Object(r.props.dbValue), "_id") === id
      );
      const item = found ?? byValue;

      if (!item) {
        throw new Error(`Item ${id} was not rendered`);
      }

      return item;
    }
  };
}
