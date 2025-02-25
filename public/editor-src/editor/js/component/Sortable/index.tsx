import { isEqual } from "es-toolkit";
import React, {
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { rolesHOC } from "visual/component/Roles";
import { SortablePluginOptions } from "visual/component/Sortable/plugin/types";
import { hideToolbar } from "visual/component/Toolbar";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import UIEvents from "visual/global/UIEvents";
import { isEditor, isView, useRender } from "visual/providers/RenderProvider";
import { updateUI } from "visual/redux/actions2";
import { uiSelector } from "visual/redux/selectors";
import { makeAttr, makeDataAttr } from "visual/utils/i18n/attribute";
import SortablePlugin from "./plugin";

interface SortableAttr {
  "data-brz-sortable-type": string;
  "data-brz-sortable-path": string;
  "data-brz-sortable-disabled": boolean;
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

  const sortablePathAttr = makeAttr("sortable-path");
  const sortableTypeAttr = makeAttr("sortable-type");

  const fromPath = from.sortableNode.getAttribute(sortablePathAttr);
  const fromType = from.sortableNode.getAttribute(sortableTypeAttr);
  const toPath = to.sortableNode.getAttribute(sortablePathAttr);
  const toType = to.sortableNode.getAttribute(sortableTypeAttr);

  const fromContainerPath = fromPath?.split("-") ?? [];
  const fromContainerType = fromType;
  const fromItemPath = [...fromContainerPath, String(from.elementIndex)];

  const toContainerPath = toPath?.split("-") ?? [];
  const toContainerType = toType;
  const toItemPath = [...toContainerPath, String(to.elementIndex)];

  // notify React to actually change state accordingly
  if (!isEqual(fromItemPath, toItemPath)) {
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
  const { renderType } = useRender();
  const dispatch = useDispatch();
  const nodeRef = useRef(null);
  const dataProps: SortableAttr | undefined = isView(renderType)
    ? undefined
    : {
        "data-brz-sortable-type": type,
        "data-brz-sortable-path": path ?? "",
        "data-brz-sortable-disabled": disabled
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

  if (!children && isEditor(renderType)) {
    return (
      <div ref={nodeRef} {...dataProps} className="brz-ed-sortable--empty">
        <div
          className="brz-ed-border__sortable brz-ed-border__inner brz-ed-border--no-space"
          {...makeDataAttr({ name: "border--grey", value: "true" })}
          {...makeDataAttr({ name: "border--dotted", value: "true" })}
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
