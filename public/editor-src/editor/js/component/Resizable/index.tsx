import React, {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  ResizableProps,
  ResizeRefType,
  ResizeType,
  SizeRefType
} from "./types";

const DEFAULT_MIN_W = 240;
const DEFAULT_MIN_H = 300;
const DEFAULT_MAX_W = 800;
const DEFAULT_MAX_H = 900;
const DEFAULT_W = 320;
const DEFAULT_H = 460;

export const Resizable = forwardRef<HTMLDivElement, ResizableProps>(
  (
    {
      initialWidth = DEFAULT_W,
      initialHeight = DEFAULT_H,
      minWidth = DEFAULT_MIN_W,
      minHeight = DEFAULT_MIN_H,
      maxWidth = DEFAULT_MAX_W,
      maxHeight = DEFAULT_MAX_H,
      initialLeft = 0,
      initialTop = 0,
      onResizeEnd,
      style,
      className,
      children,
      ...divProps
    },
    ref
  ) => {
    const [panelWidth, setPanelWidth] = useState<number>(initialWidth);
    const [panelHeight, setPanelHeight] = useState<number>(initialHeight);
    const [panelLeft, setPanelLeft] = useState<number>(initialLeft);
    const [panelTop, setPanelTop] = useState<number>(initialTop);
    const documentRef = useRef<Document>(document);

    const sizeRef = useRef<SizeRefType>({
      width: initialWidth,
      height: initialHeight,
      left: 0,
      top: 0
    });

    const resizingRef = useRef<ResizeRefType>({
      type: null,
      startX: 0,
      startY: 0,
      startW: 0,
      startH: 0,
      startL: 0,
      startT: 0
    });

    useEffect(() => {
      sizeRef.current = { width: panelWidth, height: panelHeight };
    }, [panelWidth, panelHeight]);

    const onMouseMove = useCallback(
      (e: MouseEvent) => {
        const r = resizingRef.current;
        if (!r.type) return;

        e.preventDefault();

        const deltaX = e.clientX - r.startX;
        const deltaY = e.clientY - r.startY;

        const isE = r.type?.includes(ResizeType.East) ?? false;
        const isW = r.type?.includes(ResizeType.West) ?? false;
        const isS = r.type?.includes(ResizeType.South) ?? false;
        const isN = r.type?.includes(ResizeType.North) ?? false;

        let newW = r.startW;
        let newH = r.startH;
        let newL = r.startL;
        let newT = r.startT;

        if (isE) {
          newW = Math.min(Math.max(r.startW + deltaX, minWidth), maxWidth);
        }
        if (isS) {
          newH = Math.min(Math.max(r.startH + deltaY, minHeight), maxHeight);
        }
        if (isW) {
          newW = Math.min(Math.max(r.startW - deltaX, minWidth), maxWidth);
          newL = r.startL + (r.startW - newW);
        }
        if (isN) {
          newH = Math.min(Math.max(r.startH - deltaY, minHeight), maxHeight);
          newT = r.startT + (r.startH - newH);
        }

        setPanelWidth(newW);
        setPanelHeight(newH);
        setPanelLeft(newL);
        setPanelTop(newT);
      },
      [minHeight, minWidth, maxHeight, maxWidth]
    );

    const stopResizing = useCallback(() => {
      if (!resizingRef.current.type) return;
      resizingRef.current.type = null;
      const sizes = sizeRef.current;
      onResizeEnd?.(sizes);

      if (documentRef.current) {
        documentRef.current.removeEventListener("mousemove", onMouseMove);
        documentRef.current.removeEventListener("mouseup", stopResizing);
      }
    }, [onMouseMove, onResizeEnd]);

    const startResize = useCallback(
      (type: ResizeType) => (e: ReactMouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        resizingRef.current = {
          type,
          startX: e.clientX,
          startY: e.clientY,
          startW: panelWidth,
          startH: panelHeight,
          startL: panelLeft,
          startT: panelTop
        };

        const ownerDoc = e.currentTarget.ownerDocument;

        documentRef.current = ownerDoc;

        documentRef.current.addEventListener("mousemove", onMouseMove);
        documentRef.current.addEventListener("mouseup", stopResizing);
      },
      [onMouseMove, panelHeight, panelWidth, panelLeft, panelTop, stopResizing]
    );

    useEffect(() => {
      return () => {
        if (documentRef.current) {
          documentRef.current.removeEventListener("mousemove", onMouseMove);
          documentRef.current.removeEventListener("mouseup", stopResizing);
        }
      };
    }, [onMouseMove, stopResizing]);

    const mergedStyle = useMemo(() => {
      return {
        ...style,
        width: panelWidth,
        height: panelHeight,
        left: panelLeft,
        top: panelTop
      } as CSSProperties;
    }, [style, panelWidth, panelHeight, panelLeft, panelTop]);

    return (
      <div ref={ref} className={className} style={mergedStyle} {...divProps}>
        {children}
        <div
          className="brz-resizable__resize-n"
          onMouseDown={startResize(ResizeType.North)}
        />
        <div
          className="brz-resizable__resize-e"
          onMouseDown={startResize(ResizeType.East)}
        />
        <div
          className="brz-resizable__resize-s"
          onMouseDown={startResize(ResizeType.South)}
        />
        <div
          className="brz-resizable__resize-w"
          onMouseDown={startResize(ResizeType.West)}
        />
        <div
          className="brz-resizable__resize-ne"
          onMouseDown={startResize(ResizeType.NorthEast)}
        />
        <div
          className="brz-resizable__resize-se"
          onMouseDown={startResize(ResizeType.SouthEast)}
        />
        <div
          className="brz-resizable__resize-sw"
          onMouseDown={startResize(ResizeType.SouthWest)}
        />
        <div
          className="brz-resizable__resize-nw"
          onMouseDown={startResize(ResizeType.NorthWest)}
        />
      </div>
    );
  }
);
