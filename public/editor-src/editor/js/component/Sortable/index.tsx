import React, {
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef
} from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "underscore";
import { rolesHOC } from "visual/component/Roles";
import { SortablePluginOptions } from "visual/component/Sortable/plugin/types";
import { hideToolbar } from "visual/component/Toolbar";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import UIEvents from "visual/global/UIEvents";
import { updateUI } from "visual/redux/actions2";
import { uiSelector } from "visual/redux/selectors-new";
import SortablePlugin from "./plugin";

interface SortableAttr {
  "data-sortable-type": string;
  "data-sortable-path": string;
  "data-sortable-disabled": boolean;
}

type onSortData = SortablePluginOptions["onSort"];

export interface Props {
  type: string;
  path?: string;
  showLines?: boolean;
  acceptElements?: string[];
  isGrid?: boolean;
  blindZone?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  dragOffset?: {
    top: number;
    left: number;
  };
  disabled: boolean;
  onSort?: onSortData;
  onStart?: VoidFunction;
  onEnd?: VoidFunction;
  children:
    | ((
        ref: RefObject<HTMLElement | undefined>,
        attr?: SortableAttr
      ) => ReactElement)
    | ReactElement;
}

const handleSort: onSortData = (data): void => {
  const { from, to } = data;

  const fromPath = from.sortableNode.getAttribute("data-sortable-path");
  const fromType = from.sortableNode.getAttribute("data-sortable-type");
  const toPath = to.sortableNode.getAttribute("data-sortable-path");
  const toType = to.sortableNode.getAttribute("data-sortable-type");

  const fromContainerPath = fromPath?.split("-") ?? [];
  const fromContainerType = fromType;
  const fromItemPath = [...fromContainerPath, String(from.elementIndex)];

  const toContainerPath = toPath?.split("-") ?? [];
  const toContainerType = toType;
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

const Sortable = (props: Props): ReactElement => {
  const {
    acceptElements,
    isGrid,
    blindZone,
    dragOffset,
    showLines,
    children,
    type,
    path,
    disabled,
    onSort: _onSort,
    onEnd,
    onStart
  } = props;
  const { deviceMode } = useSelector(uiSelector);
  const dispatch = useDispatch();
  const nodeRef = useRef(null);
  const dataProps: SortableAttr | undefined = IS_PREVIEW
    ? undefined
    : {
        "data-sortable-type": type,
        "data-sortable-path": path ?? "",
        "data-sortable-disabled": disabled
      };
  const onSort = typeof _onSort === "function" ? _onSort : handleSort;

  const handleEmptyClick = useCallback((): void => {
    dispatch(
      updateUI("leftSidebar", {
        isOpen: true,
        drawerContentType: LeftSidebarOptionsIds.addElements
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const node = nodeRef.current;
    let sortablePlugin: SortablePlugin | undefined;

    if (node) {
      sortablePlugin = new SortablePlugin(node, {
        acceptElements,
        isGrid,
        blindZone,
        dragOffset,
        showLines,
        cancelClass: "brz-ed-dd-cancel",
        onBeforeStart(e): void {
          if (deviceMode === "mobile" || deviceMode === "tablet") {
            e.preventDefault();
          }
        },
        onStart(): void {
          document.body.classList.add("brz-ed-sorting");

          requestAnimationFrame(() => {
            hideToolbar();
          });
          onStart?.();
        },
        onEnd(): void {
          document.body.classList.remove("brz-ed-sorting");
          onEnd?.();
        },
        onSort
      });
    }

    return (): void => {
      sortablePlugin?.destroy();
    };
  }, [
    deviceMode,
    acceptElements,
    blindZone,
    dragOffset,
    isGrid,
    onEnd,
    onSort,
    onStart,
    showLines
  ]);

  if (!children && IS_EDITOR) {
    return (
      <div ref={nodeRef} {...dataProps} className="brz-ed-sortable--empty">
        <div
          className="brz-ed-border__sortable brz-ed-border__inner brz-ed-border--no-space"
          data-border--grey="true"
          data-border--dotted="true"
        />
        <div
          className="brz-ed-container-trigger brz-ed-container-trigger--small"
          onClick={handleEmptyClick}
        />
      </div>
    );
  }

  if (typeof children === "function") {
    return children(nodeRef, dataProps);
  } else {
    return React.cloneElement(React.Children.only(children), {
      ...dataProps,
      ref: nodeRef
    });
  }
};

export default rolesHOC({
  allow: ["admin"],
  component: Sortable,
  fallbackRender: ({
    children
  }: {
    children: ReactNode | (() => ReactNode);
  }) => {
    if (typeof children === "function") {
      return children();
    }
    return children;
  }
});
