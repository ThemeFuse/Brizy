import React from "react";
import _ from "underscore";
import { findDOMNode } from "react-dom";
import SortablePlugin from "./plugin";
import UIEvents from "visual/global/UIEvents";
import { hideToolbar } from "visual/component/Toolbar";
import { rolesHOC } from "visual/component/Roles";
import { updateUI } from "visual/redux/actions2";
import { getStore } from "visual/redux/store";

const onSort = data => {
  const { from, to } = data;

  const fromContainerPath = from.sortableNode
    .getAttribute("data-sortable-path")
    .split(".");
  const fromContainerType = from.sortableNode.getAttribute(
    "data-sortable-type"
  );
  const fromItemPath = [...fromContainerPath, String(from.elementIndex)];

  const toContainerPath = to.sortableNode
    .getAttribute("data-sortable-path")
    .split(".");
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

class Sortable extends React.Component {
  static defaultProps = {
    path: [],
    type: "",
    acceptElements: [],
    isGrid: false,
    blindZone: null,
    disabled: false,
    onSort,
    onStart: _.noop,
    onEnd: _.noop
  };

  componentDidMount() {
    const {
      acceptElements,
      isGrid,
      blindZone,
      onStart,
      onSort,
      onEnd
    } = this.props;
    // eslint-disable-next-line react/no-find-dom-node
    const node = findDOMNode(this);

    this.plugin = new SortablePlugin(node, {
      acceptElements,
      isGrid,
      blindZone,
      cancelClass: "brz-ed-dd-cancel",
      onBeforeStart(e) {
        const {
          ui: { deviceMode }
        } = getStore().getState();

        if (deviceMode === "mobile" || deviceMode === "tablet") {
          e.preventDefault();
        }
      },
      onStart() {
        document.body.classList.add("brz-ed-sorting");

        requestAnimationFrame(hideToolbar);
        onStart();
      },
      onEnd() {
        document.body.classList.remove("brz-ed-sorting");
        onEnd();
      },
      onSort
    });
  }

  componentWillUnmount() {
    this.plugin.destroy();
  }

  handleEmptyClick = () => {
    getStore().dispatch(
      updateUI("leftSidebar", {
        isOpen: true,
        drawerContentType: "addElements"
      })
    );
  };

  render() {
    const { children, type, path, disabled } = this.props;

    if (IS_PREVIEW) {
      return React.Children.only(children);
    }

    if (!children) {
      return (
        <div
          className="brz-ed-sortable--empty"
          data-sortable-type={type}
          data-sortable-path={path.join(".")}
          data-sortable-disabled={disabled}
        >
          <div className="brz-ed-border__sortable brz-ed-border__inner brz-ed-border--no-space brz-ed-border--grey brz-ed-border--dotted" />
          <div
            className="brz-ed-container-trigger brz-ed-container-trigger--small"
            onClick={this.handleEmptyClick}
          />
        </div>
      );
    }

    return React.cloneElement(React.Children.only(children), {
      "data-sortable-type": type,
      "data-sortable-path": path.join("."),
      "data-sortable-disabled": disabled
    });
  }
}

export default rolesHOC({
  allow: ["admin"],
  component: Sortable,
  fallbackRender: ({ children }) => children
});
