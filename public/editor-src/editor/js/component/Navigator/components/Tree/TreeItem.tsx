import classnames from "classnames";
import React, {
  CSSProperties,
  MouseEvent,
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isStory, useEditorMode } from "visual/providers/EditorModeProvider";
import { useTreeContext } from "visual/providers/TreeProvider";
import { attachRefs } from "visual/utils/react";
import { TreeItemProps } from "./types";
import { SPACING_SIZE, getDragPad } from "./utils";

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      depth,
      item,
      wrapperRef,
      childCount,
      clone,
      ghost,
      handleProps,
      style,
      invalid,
      showToggleIcon
    },
    ref
  ) => {
    const {
      toggleExpand,
      toggleShowElement,
      activeId,
      onClickItem,
      onRemoveItem
    } = useTreeContext();

    const isStoryMode = isStory(useEditorMode().mode);

    const internalRef = useRef<HTMLElement>(null);
    const { title, icon, collapsed, id, isHidden, type } = item;

    const itemClasses = classnames("brz-navigator-list-item", {
      "brz-navigator-list-item-active": activeId === id,
      "brz-navigator-list-item-expanded": !collapsed,
      "brz-navigator-list-item-invalid": !!invalid
    });

    const wrapperClasses = classnames("brz-navigator-list-item-wrapper", {
      "brz-navigator-list-item-wrapper-clone": clone,
      "brz-navigator-list-item-wrapper-ghost": ghost
    });

    const handleClickItem = useCallback(() => {
      onClickItem(id);
    }, [id, onClickItem]);

    const handleClickExpand = useCallback(
      (e: MouseEvent) => {
        e.stopPropagation();
        toggleExpand(id);
      },
      [id, toggleExpand]
    );

    const handleClickShowElement = useCallback(
      (e: MouseEvent) => {
        e.stopPropagation();
        toggleShowElement(id);
      },
      [id, toggleShowElement]
    );

    const handleRemoveItem = useCallback(
      (e: MouseEvent) => {
        e.stopPropagation();
        onRemoveItem(id);
      },
      [id, onRemoveItem]
    );

    const wrapperStyle = useMemo(
      () =>
        ({
          "--spacing": `${SPACING_SIZE * (depth + 1)}px`,
          "--drag-pad": getDragPad(depth)
        }) as CSSProperties,
      [depth]
    );

    // Scroll into view if this item is active
    useEffect(() => {
      if (activeId === id && internalRef.current) {
        internalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }, [activeId, id, ref]);

    const handleAttachRefs = useCallback(
      (el: HTMLElement | null) => {
        attachRefs(el, [ref as RefObject<HTMLElement>, internalRef]);
      },
      [ref]
    );

    const isSectionItem =
      type === ElementTypes.SectionItem ||
      type === ElementTypes.SectionHeaderStickyItem ||
      type === ElementTypes.SectionHeaderItem;

    const hideRemoveButton =
      type === ElementTypes.StoryItem ||
      type === ElementTypes.Story ||
      isSectionItem;

    const hideShowButton = isStoryMode || isSectionItem;

    const handleProperties = isSectionItem ? undefined : handleProps;

    return (
      <li
        ref={wrapperRef}
        className={wrapperClasses}
        style={wrapperStyle}
        onClick={handleClickItem}
      >
        <div className={itemClasses} ref={handleAttachRefs} style={style}>
          {handleProperties && (
            <span
              className="brz-navigator-list-item-icon-drag"
              {...handleProperties}
            >
              <EditorIcon icon="t2-reorder" />
            </span>
          )}
          {showToggleIcon && (
            <EditorIcon
              icon="nc-mask-shape-triangle"
              className="brz-navigator-list-item-icon-arrow"
              onClick={handleClickExpand}
            />
          )}
          {icon && (
            <EditorIcon
              icon={icon}
              className="brz-navigator-list-item-icon-widget"
            />
          )}
          {title}
          {!clone && (
            <>
              {!hideShowButton && (
                <EditorIcon
                  icon={isHidden ? "nc-eye-ban-18" : "nc-eye-17"}
                  className="brz-navigator-list-item-icon-show"
                  onClick={handleClickShowElement}
                />
              )}
              {!hideRemoveButton && (
                <EditorIcon
                  icon="nc-trash"
                  className="brz-navigator-list-item-icon-trash"
                  onClick={handleRemoveItem}
                />
              )}
            </>
          )}
        </div>
        {clone && childCount && childCount > 1 && (
          <span className="brz-navigator-list-item-wrapper-children">
            {childCount}
          </span>
        )}
      </li>
    );
  }
);
