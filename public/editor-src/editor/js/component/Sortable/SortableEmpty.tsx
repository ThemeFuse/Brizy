import React, { Component, ElementType, ReactElement } from "react";
import _ from "underscore";
import { findDOMNode } from "react-dom";
import SortablePlugin from "./plugin";
import { hideToolbar } from "visual/component/Toolbar";
import { rolesHOC } from "visual/component/Roles";
import { updateUI } from "visual/redux/actions2";
import { getStore } from "visual/redux/store";
import UIEvents from "visual/global/UIEvents";
import { SortablePluginOptions } from "./plugin/types";

type SortType =
  | "section"
  | "row"
  | "column"
  | "carousel"
  | "posts"
  | "cloneable"
  | "addable";

type SortData = {
  from: {
    sortableNode: HTMLElement;
    elementNode: HTMLElement;
    elementIndex: number;
    elementType: SortType;
  };
  to: {
    sortableNode: HTMLElement;
    elementIndex: number;
  };
};

const onSort: SortablePluginOptions["onSort"] = (data): void => {
  const { from, to } = data;

  const fromContainerPath =
    from.sortableNode.getAttribute("data-sortable-path")?.split(".") || [];
  const fromContainerType = from.sortableNode.getAttribute(
    "data-sortable-type"
  );
  const fromItemPath = [...fromContainerPath, String(from.elementIndex)];

  const toContainerPath =
    to.sortableNode?.getAttribute("data-sortable-path")?.split(".") || [];
  const toContainerType = to.sortableNode.getAttribute("data-sortable-type");
  const toItemPath = [...toContainerPath, String(to.elementIndex)];

  // notify React to actually change state accordingly
  if (!_.isEqual(fromItemPath, toItemPath)) {
    UIEvents.emit("dnd.sort", {
      from: {
        containerPath: fromContainerPath,
        containerType: fromContainerType,
        itemIndex: from.elementIndex,
        itemPath: fromItemPath,
        itemType: from.elementType
      },
      to: {
        containerPath: toContainerPath,
        containerType: toContainerType,
        itemIndex: to.elementIndex,
        itemPath: toItemPath
      }
    });
  }
};
const onBeforeStart: SortablePluginOptions["onBeforeStart"] = (e): void => {
  const {
    ui: { deviceMode }
  } = getStore().getState();

  if (deviceMode === "mobile" || deviceMode === "tablet") {
    e.preventDefault();
  }
};
const onStart = (): void => {
  document.body.classList.add("brz-ed-sorting");
  requestAnimationFrame(hideToolbar);
};
const onEnd = (): void => {
  document.body.classList.remove("brz-ed-sorting");
};

type Props = {
  type: SortType;
  path: Array<string>;
  disabled?: boolean;
  children?: ((props: {}) => ReactElement) | ElementType;
} & Pick<SortablePluginOptions, "acceptElements">;

class Sortable extends Component<Props> {
  static defaultProps: Partial<Props> = {
    path: [],
    acceptElements: [],
    disabled: false
  };

  plugin: unknown = undefined;

  componentDidMount(): void {
    const { acceptElements } = this.props;
    // eslint-disable-next-line react/no-find-dom-node
    const node = findDOMNode(this);

    if (!(node instanceof HTMLElement)) {
      return;
    }
    this.plugin = new SortablePlugin(node, {
      acceptElements,
      cancelClass: "brz-ed-dd-cancel",
      onBeforeStart,
      onStart,
      onEnd,
      onSort
    });
  }

  componentWillUnmount(): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.plugin.destroy();
  }

  handleEmptyClick = (): void => {
    getStore().dispatch(
      updateUI("leftSidebar", {
        isOpen: true,
        drawerContentType: "addElements"
      })
    );
  };

  render(): ReactElement | null {
    const { type, path, disabled } = this.props;

    if (IS_PREVIEW) {
      return null;
    }

    return (
      <div
        className="brz-ed-sortable--empty"
        data-sortable-type={type}
        data-sortable-path={path.join(".")}
        data-sortable-disabled={disabled}
      >
        <div
          className="brz-ed-border__sortable brz-ed-border__inner brz-ed-border--no-space"
          data-border--grey="true"
          data-border--dotted="true"
        />
        <div
          className="brz-ed-container-trigger brz-ed-container-trigger--small"
          onClick={this.handleEmptyClick}
        />
      </div>
    );
  }
}

export default rolesHOC({
  allow: ["admin"],
  component: Sortable,
  fallbackRender: ({ children }: { children: ElementType }) => children
});
