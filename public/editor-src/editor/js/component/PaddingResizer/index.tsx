import React, { useCallback, useRef } from "react";
import { useStore } from "react-redux";
import { isView } from "visual/providers/RenderProvider";
import { deviceModeSelector } from "visual/redux/selectors";
import { FCC } from "visual/utils/react/types";
import Handle from "./Handle";
import { DragInfo, Props, Value } from "./types";

type ChangedTypes = keyof Omit<
  Value,
  "paddingType" | "tabletPaddingType" | "mobilePaddingType"
>;

const PaddingResizer: FCC<Props> = (props) => {
  const { value, onChange, onStart, onEnd, children, renderContext } = props;
  const startPositionRef = useRef<null | number>(null);
  const store = useStore();

  const handleDrag = useCallback(
    (_type: "paddingTop" | "paddingBottom", { deltaY }: DragInfo) => {
      const deviceMode = deviceModeSelector(store.getState());

      let type: ChangedTypes =
        value.paddingType === "grouped" ? "padding" : _type;

      if (deviceMode === "tablet") {
        type = value.tabletPaddingType === "grouped" ? "padding" : type;

        const capitalizedFirstLetter =
          type.charAt(0).toUpperCase() + type.slice(1);
        type = `tablet${capitalizedFirstLetter}` as ChangedTypes;
      }

      if (deviceMode === "mobile") {
        type = value.mobilePaddingType === "grouped" ? "padding" : type;

        const capitalizedFirstLetter =
          type.charAt(0).toUpperCase() + type.slice(1);
        type = `mobile${capitalizedFirstLetter}` as ChangedTypes;
      }

      startPositionRef.current = startPositionRef.current || value[type];
      const v = Math.max(15, startPositionRef.current + deltaY);

      let newValue = {};

      switch (type) {
        case "paddingTop":
          newValue = {
            paddingType: "ungrouped",
            paddingTop: v
          };
          break;
        case "paddingBottom":
          newValue = {
            paddingType: "ungrouped",
            paddingBottom: v
          };
          break;
        case "tabletPaddingTop":
          newValue = {
            tabletPaddingType: "ungrouped",
            tabletPaddingTop: v
          };
          break;
        case "tabletPaddingBottom":
          newValue = {
            tabletPaddingType: "ungrouped",
            tabletPaddingBottom: v
          };
          break;
        case "mobilePaddingTop":
          newValue = {
            mobilePaddingType: "ungrouped",
            mobilePaddingTop: v
          };
          break;
        case "mobilePaddingBottom":
          newValue = {
            mobilePaddingType: "ungrouped",
            mobilePaddingBottom: v
          };
          break;
        case "padding":
          newValue = {
            paddingType: "ungrouped",
            paddingTop: value[type],
            paddingBottom: value[type],
            [type]: v
          };
          break;
        case "tabletPadding":
          newValue = {
            tabletPaddingType: "ungrouped",
            tabletPaddingTop: value[type],
            tabletPaddingBottom: value[type],
            [type]: v
          };
          break;
        case "mobilePadding":
          newValue = {
            mobilePaddingType: "ungrouped",
            mobilePaddingTop: value[type],
            mobilePaddingBottom: value[type],
            [type]: v
          };
          break;
      }

      onChange(newValue);
    },
    [onChange, value, store]
  );

  const handleTopDrag = useCallback(
    (dragInfo: DragInfo) => {
      handleDrag("paddingTop", dragInfo);
    },
    [handleDrag]
  );

  const handleBottomDrag = useCallback(
    (dragInfo: DragInfo) => {
      handleDrag("paddingBottom", dragInfo);
    },
    [handleDrag]
  );

  const handleDragEnd = useCallback(() => {
    startPositionRef.current = null;
  }, []);

  if (isView(renderContext)) {
    return <>{children}</>;
  }

  let {
    /* eslint-disable prefer-const */
    padding,
    tabletPadding,
    mobilePadding,
    paddingType,
    tabletPaddingType,
    mobilePaddingType,
    /* eslint-enable prefer-const */
    paddingTop,
    paddingBottom,
    tabletPaddingTop,
    tabletPaddingBottom,
    mobilePaddingTop,
    mobilePaddingBottom
  } = value;

  if (paddingType === "grouped") {
    paddingTop = paddingBottom = padding;
  }
  if (tabletPaddingType === "grouped") {
    tabletPaddingTop = tabletPaddingBottom = tabletPadding;
  }
  if (mobilePaddingType === "grouped") {
    mobilePaddingTop = mobilePaddingBottom = mobilePadding;
  }

  return (
    <>
      <Handle
        position="top"
        onStart={onStart}
        onEnd={onEnd}
        onDrag={handleTopDrag}
        onDragEnd={handleDragEnd}
        value={`${paddingTop}px`}
        tabletValue={`${tabletPaddingTop}px`}
        mobileValue={`${mobilePaddingTop}px`}
      />
      {children}
      <Handle
        position="bottom"
        onStart={onStart}
        onEnd={onEnd}
        onDrag={handleBottomDrag}
        onDragEnd={handleDragEnd}
        value={`${paddingBottom}px`}
        tabletValue={`${tabletPaddingBottom}px`}
        mobileValue={`${mobilePaddingBottom}px`}
      />
    </>
  );
};

export default PaddingResizer;
