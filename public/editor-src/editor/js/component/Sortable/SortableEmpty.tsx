import { isEqual } from "es-toolkit";
import React, {
  ElementType,
  ReactElement,
  useCallback,
  useEffect,
  useRef
} from "react";
import { useDispatch, useStore } from "react-redux";
import { rolesHOC } from "visual/component/Roles";
import { hideToolbar } from "visual/component/Toolbar";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import UIEvents from "visual/global/UIEvents";
import { renderHOC } from "visual/providers/RenderProvider/renderHOC";
import { ReduxAction, updateUI } from "visual/redux/actions2";
import { deviceModeSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { makeAttr, makeDataAttr } from "visual/utils/i18n/attribute";
import SortablePlugin from "./plugin";
import { SortablePluginOptions } from "./plugin/types";

type SortType =
  | "section"
  | "row"
  | "column"
  | "carousel"
  | "posts"
  | "cloneable"
  | "addable";

const fallbackRender = () => {
  return (
    <div className="brz-ed-sortable--empty brz-blocked">
      <div
        className="brz-ed-border__sortable brz-ed-border__inner brz-ed-border--no-space"
        {...makeDataAttr({ name: "border--grey", value: "true" })}
        {...makeDataAttr({ name: "border--dotted", value: "true" })}
      />
      <div className="brz-ed-container-trigger brz-ed-container-trigger--small" />
    </div>
  );
};

type Props = {
  type: SortType;
  path: Array<string>;
  disabled?: boolean;
  children?: ((props: unknown) => ReactElement) | ElementType;
} & Pick<SortablePluginOptions, "acceptElements">;

const Sortable = (props: Props) => {
  const { type, path, disabled, acceptElements } = props;
  const store = useStore<ReduxState, ReduxAction>();
  const dispatch = useDispatch();
  const nodeRef = useRef<HTMLDivElement>(null);
  const handleBeforeStart = useCallback<
    Required<SortablePluginOptions>["onBeforeStart"]
  >(
    (e) => {
      const deviceMode = deviceModeSelector(store.getState());

      if (deviceMode === "mobile" || deviceMode === "tablet") {
        e.preventDefault();
      }
    },
    [store]
  );

  const handleStart = useCallback(() => {
    document.body.classList.add("brz-ed-sorting");
    requestAnimationFrame(() => {
      hideToolbar();
    });
  }, []);

  const handleEnd = useCallback(() => {
    document.body.classList.remove("brz-ed-sorting");
  }, []);

  const handleSort = useCallback<Required<SortablePluginOptions>["onSort"]>(
    (data) => {
      const { from, to } = data;

      const fromContainerPath =
        from.sortableNode.getAttribute(makeAttr("sortable-path"))?.split("-") ||
        [];
      const fromContainerType = from.sortableNode.getAttribute(
        makeAttr("sortable-type")
      );
      const fromItemPath = [...fromContainerPath, String(from.elementIndex)];

      const toContainerPath =
        to.sortableNode?.getAttribute(makeAttr("sortable-path"))?.split("-") ||
        [];
      const toContainerType = to.sortableNode.getAttribute(
        makeAttr("sortable-type")
      );
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
    },
    []
  );

  const handleEmptyClick = useCallback(() => {
    dispatch(
      updateUI("leftSidebar", {
        drawerContentType: LeftSidebarOptionsIds.addElements
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const node = nodeRef.current;

    if (!node) {
      return;
    }

    const sortablePlugin = new SortablePlugin(node, {
      acceptElements,
      cancelClass: "brz-ed-dd-cancel",
      onBeforeStart: handleBeforeStart,
      onStart: handleStart,
      onEnd: handleEnd,
      onSort: handleSort
    });

    return (): void => {
      sortablePlugin.destroy();
    };
  }, [acceptElements, handleBeforeStart, handleEnd, handleSort, handleStart]);

  return (
    <div
      ref={nodeRef}
      className="brz-ed-sortable--empty"
      {...makeDataAttr({ name: "sortable-type", value: type })}
      {...makeDataAttr({ name: "sortable-path", value: path })}
      {...makeDataAttr({
        name: "sortable-disabled",
        value: String(disabled)
      })}
    >
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
};

export default rolesHOC({
  allow: ["admin"],
  component: renderHOC({
    ForEdit: Sortable,
    ForView: () => <></>
  }),
  fallbackRender: ({ children }: { children: ElementType }) =>
    children ?? fallbackRender()
});
