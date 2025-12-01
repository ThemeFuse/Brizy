import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { FC, RefObject, useCallback, useMemo, useState } from "react";
import EditorIcon from "visual/component/EditorIcon";
import PointerEvents from "visual/component/PointerEvents";
import { Resizable } from "visual/component/Resizable";
import { attachRef } from "visual/utils/react";
import Header from "./Header";
import NavigatorItems from "./Items";
import { getLayoutSettings, setLayoutSettings } from "./utils";

export interface Props {
  onClose: VoidFunction;
  focusedElementId: string | null;
  position?: {
    x: number;
    y: number;
  };
}

const RIGHT_OFFSET = 20;
const TOP_OFFSET = 80;

export const NavigatorPanel: FC<Props> = ({
  onClose,
  position,
  focusedElementId
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: "brz-navigator" });

  const [resizeKey, setResizeKey] = useState(0);
  const initialSize = useMemo(getLayoutSettings, []);
  const initialWidth = initialSize.width;
  const parentWin =
    typeof window !== "undefined" && window.parent ? window.parent : window;
  const initialLeft = parentWin.innerWidth - (initialWidth ?? 0) - RIGHT_OFFSET;

  const style = useMemo(
    () => ({
      transform: CSS.Translate.toString({
        ...transform,
        scaleX: transform?.scaleX ?? 1,
        scaleY: transform?.scaleY ?? 1,
        x: (position?.x ?? 0) + (transform?.x ?? 0),
        y: (position?.y ?? 0) + (transform?.y ?? 0)
      })
    }),
    [transform, position]
  );

  const handleResizeEnd = useCallback(
    (size: { width: number; height: number }) => {
      setLayoutSettings(size);
      // Force re-render of scrollbar by updating the key
      setResizeKey((prev) => prev + 1);
    },
    []
  );

  const handleAttachRef = useCallback(
    (ref: RefObject<HTMLElement>) => (el: HTMLElement | null) => {
      setNodeRef(el);
      attachRef(el, ref);
    },
    [setNodeRef]
  );

  return (
    <PointerEvents>
      {({ ref }: { ref: RefObject<HTMLElement> }) => (
        <Resizable
          className="brz-navigator"
          style={style}
          initialWidth={initialSize.width}
          initialHeight={initialSize.height}
          ref={handleAttachRef(ref)}
          onResizeEnd={handleResizeEnd}
          initialLeft={initialLeft}
          initialTop={TOP_OFFSET}
        >
          <Header
            attr={attributes}
            onClose={onClose}
            listeners={listeners}
            isDragging={isDragging}
          />
          <NavigatorItems key={resizeKey} focusedElementId={focusedElementId} />
          <div className="brz-navigator-footer">
            <EditorIcon icon="nc-more" />
          </div>
        </Resizable>
      )}
    </PointerEvents>
  );
};
