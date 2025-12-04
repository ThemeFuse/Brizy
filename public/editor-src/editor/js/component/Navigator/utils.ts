import { Modifier } from "@dnd-kit/core";
import { clamp } from "es-toolkit/compat";
import { Component, RefObject } from "react";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import UIEvents from "visual/global/UIEvents";
import { getComponentId } from "visual/utils/models/path";

export const openNavigatorFromContextMenu = (
  component: Component,
  itemIndex: number
): void => {
  const elementId =
    component instanceof EditorArrayComponent
      ? getComponentId(component, itemIndex)
      : null;

  UIEvents.emit("navigator.open", { elementId });
};

export const createRestrictToTopWindowEdges = (
  persistedRef: RefObject<{ x: number; y: number }>
): Modifier => {
  return ({ transform, draggingNodeRect }) => {
    if (!draggingNodeRect) return transform;
    let topWindow: Window | undefined;
    try {
      topWindow =
        typeof window !== "undefined" ? (window.top ?? window) : undefined;
      /* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
      topWindow && topWindow.innerWidth; // cross-origin safety check
    } catch {
      topWindow = undefined;
    }

    const viewportWidth = topWindow?.innerWidth ?? window.innerWidth;
    const viewportHeight = topWindow?.innerHeight ?? window.innerHeight;

    const { left, top, width, height } = draggingNodeRect;

    // use persisted offset
    const currentLeft = left + (persistedRef.current?.x ?? 0);
    const currentTop = top + (persistedRef.current?.y ?? 0);

    const minX = -currentLeft;
    const minY = -currentTop;
    const maxX = viewportWidth - (currentLeft + width);
    const maxY = viewportHeight - (currentTop + height);

    return {
      ...transform,
      x: clamp(transform.x, minX, maxX),
      y: clamp(transform.y, minY, maxY)
    };
  };
};
