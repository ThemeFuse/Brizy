import React, { FC, ReactNode, Ref, useCallback, useState } from "react";
import { WithOnChange } from "visual/utils/options/attributes";
import { Value } from "./entities/Value";
import { HAlign } from "visual/utils/position/HAlign";
import { VAlign } from "visual/utils/position/VAlign";
import { Draggable as Drag } from "visual/component/Draggable";

type Delta = { deltaX: number; deltaY: number };
type Props = WithOnChange<Value> & {
  active?: boolean;
  hAlign: HAlign;
  vAlign: VAlign;
  xSuffix: string;
  ySuffix: string;
  getValue: () => {
    x: number;
    y: number;
  };
  getContainerSizes: () => {
    width: number;
    height: number;
  };
  onStart?: (value: Value) => void;
  onEnd?: (value: Value) => void;
  children: (ref: Ref<HTMLElement>, className?: string) => ReactNode;
};

export const Draggable: FC<Props> = ({
  active,
  children,
  onChange,
  onStart,
  onEnd,
  hAlign,
  vAlign,
  xSuffix,
  ySuffix,
  getValue,
  getContainerSizes
}) => {
  // we don't just send x & y because of responsive
  // when we change device mode, editor doesn't rerender
  // and old props were using
  const { x, y } = getValue();
  const [v, setValue] = useState<Value>({ x, y });

  const onDrag = useCallback(
    ({ deltaX, deltaY }: Delta) => {
      const { width: cW, height: cH } = getContainerSizes();
      const offsetX = xSuffix === "px" ? deltaX : (deltaX * 100) / cW;
      const offsetY = ySuffix === "px" ? deltaY : (deltaY * 100) / cH;

      onChange({
        x: Math.round(v.x + offsetX),
        y: Math.round(v.y + offsetY)
      });
    },
    [hAlign, vAlign, v.x, v.y]
  );
  const onDragStart = useCallback(() => {
    const { x, y } = getValue();

    if (v.x !== x || v.y !== y) {
      onStart && onStart({ x, y });
      setValue({ x, y });
    }
  }, [x, y]);

  const onDragEnd = useCallback(() => {
    const { x, y } = getValue();

    if (v.x !== x || v.y !== y) {
      onEnd && onEnd({ x, y });
    }
  }, [x, y]);

  return (
    <Drag
      active={active}
      exceptions={[
        ".brz-ed-toolbar",
        ".brz-ed-tooltip__content-portal",
        ".brz-rich-text .brz-ed-content-editable-focus"
      ]}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
    >
      {children}
    </Drag>
  );
};
