import { DndContext, DragEndEvent, Modifier } from "@dnd-kit/core";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { createRestrictToTopWindowEdges } from "visual/component/Navigator/utils";
import UIEvents from "visual/global/UIEvents";
import { TreeContextProvider } from "visual/providers/TreeProvider";
import { NavigatorPanel, type Props as PanelProps } from "./components/Panel";

export const NavigatorRoot: FC = () => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [focusId, setFocusId] = useState<string | null>(null);
  const persistedRef = useRef({ x: 0, y: 0 });

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (event.delta) {
      setPosition((prev) => ({
        x: prev.x + event.delta.x,
        y: prev.y + event.delta.y
      }));

      persistedRef.current.x += event.delta.x;
      persistedRef.current.y += event.delta.y;
    }
  }, []);

  useEffect(() => {
    const openHandler = (payload?: { elementId?: string }) => {
      setOpen(true);
      setFocusId(payload?.elementId || null);
    };
    const closeHandler = () => setOpen(false);

    UIEvents.on("navigator.open", openHandler);
    UIEvents.on("navigator.close", closeHandler);
    return () => {
      UIEvents.off("navigator.open", openHandler);
      UIEvents.off("navigator.close", closeHandler);
    };
  }, []);

  const handleCloseNavigator = useCallback(() => {
    setOpen(false);
  }, []);

  if (!open) {
    return null;
  }

  return (
    <NavigatorWrapper
      onDragEnd={handleDragEnd}
      position={position}
      onClose={handleCloseNavigator}
      focusedElementId={focusId}
      restrictModifier={createRestrictToTopWindowEdges(persistedRef)}
    />
  );
};

interface NavigatorWrapperProps extends PanelProps {
  onDragEnd?: (event: DragEndEvent) => void;
  restrictModifier: Modifier;
}

const NavigatorWrapper: FC<NavigatorWrapperProps> = ({
  onDragEnd,
  restrictModifier,
  ...props
}) => (
  <DndContext onDragEnd={onDragEnd} modifiers={[restrictModifier]}>
    <TreeContextProvider>
      <NavigatorPanel {...props} />
    </TreeContextProvider>
  </DndContext>
);

export default NavigatorRoot;
