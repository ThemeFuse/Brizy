import React, {
  ReactElement,
  ReactNode,
  Ref,
  useCallback,
  useState
} from "react";
import { Draggable as Drag } from "visual/component/Draggable";
import { WithOnChange } from "visual/types/attributes";
import { HAlign } from "visual/utils/position/HAlign";
import { VAlign } from "visual/utils/position/VAlign";
import { Value } from "./entities/Value";

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

export const Draggable = ({
  active,
  children,
  onChange,
  onStart,
  onEnd,
  xSuffix,
  ySuffix,
  getValue,
  getContainerSizes
}: Props): ReactElement => {
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
    [v, getContainerSizes, onChange, xSuffix, ySuffix]
  );
  const onDragStart = useCallback(() => {
    const { x, y } = getValue();

    if (v.x !== x || v.y !== y) {
      onStart && onStart({ x, y });
      setValue({ x, y });
    }
  }, [getValue, onStart, v]);

  const onDragEnd = useCallback(() => {
    const { x, y } = getValue();

    if (v.x !== x || v.y !== y) {
      onEnd && onEnd({ x, y });
    }
  }, [getValue, onEnd, v]);

  return (
    <Drag
      active={active}
      exceptions={[
        ".brz-ed-toolbar",
        ".brz-ed-tooltip__content-portal",
        ".brz-rich-text .brz-ed-content-editable-focus",
        ".brz-ed-eyeDropper"
      ]}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
    >
      {children}
    </Drag>
  );
};
