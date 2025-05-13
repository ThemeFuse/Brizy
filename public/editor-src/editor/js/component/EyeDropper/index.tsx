import classNames from "classnames";
import { isT } from "fp-utilities";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { EMPTY, from, fromEvent } from "rxjs";
import {
  catchError,
  debounceTime,
  filter,
  map,
  switchMap
} from "rxjs/operators";
import { EditorIcon } from "visual/component/EditorIcon";
import { useThrottleOnChange } from "visual/component/hooks";
import { SectionPopup2Instances } from "visual/editorComponents/SectionPopup2/instances";
import { SectionPopupInstances } from "visual/editorComponents/SectionPopup/instances";
import { useConfig } from "visual/providers/ConfigProvider";
import { Hex, fromRgb } from "visual/utils/color/Hex";
import { always } from "visual/utils/fp";
import { browserSupports, makeNodeScreenshot } from "visual/utils/screenshots";
import * as State from "./types";
import { Coords, Type } from "./types";
import { nodeClasses, scrollValue } from "./utils";

export interface Props {
  onPick: (hex: Hex) => void;
}

export const EyeDropper = forwardRef<HTMLDivElement, Props>(
  ({ onPick }, ref): JSX.Element | null => {
    const [state, setState] = useState<State.State>(State.idle());
    const pointerRef = useRef<HTMLElement>(null);
    const scrollRef = useRef<Coords>({ x: 0, y: 0 });
    const coordsRef = useRef<Coords>({ x: 0, y: 0 });
    const colorRef = useRef<Hex | null>(null);
    const config = useConfig();

    const updatePointer = () => {
      if (pointerRef.current !== null) {
        const x = coordsRef.current.x;
        const y = coordsRef.current.y;
        pointerRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    const f = useCallback(
      (c: Coords) => {
        switch (state.type) {
          case Type.Idle:
          case Type.Loading:
            return state;
          case Type.Active: {
            const data = state.context.c2d.getImageData(
              c.x + Math.abs(scrollRef.current.x),
              c.y + Math.abs(scrollRef.current.y),
              1,
              1
            ).data;

            const hex = fromRgb([data[0], data[1], data[2]]);

            colorRef.current = hex;
            if (pointerRef.current !== null) {
              pointerRef.current.style.backgroundColor = hex;
            }
          }
        }
      },
      [state]
    );
    const [, updateColor] = useThrottleOnChange(coordsRef.current, f, 50);

    const setCoords = useCallback<React.MouseEventHandler>(
      (e) => {
        coordsRef.current = { x: e.clientX, y: e.clientY };
        updatePointer();
        updateColor(coordsRef.current);
      },
      [updateColor]
    );
    const setScroll = (c: Coords) => (scrollRef.current = c);

    useEffect(() => {
      const popups = [
        ...SectionPopupInstances.values(),
        ...SectionPopup2Instances.values()
      ];

      const node =
        popups.find((p) => p.state.isOpened)?.el.children[0] ??
        document.getElementById("brz-ed-page__blocks");

      if (node) {
        setState(State.loading({ node }));
      }
    }, []);

    const preventClick = useCallback<React.MouseEventHandler>(
      (e) => {
        e.stopPropagation();

        colorRef.current && onPick(colorRef.current);
      },
      [onPick]
    );

    useEffect(() => {
      switch (state.type) {
        case Type.Idle:
          return undefined;
        case Type.Loading:
        case Type.Active: {
          const cb = (e: Event) => {
            e.stopPropagation();

            colorRef.current && onPick(colorRef.current);
          };

          state.context.node.addEventListener("click", cb);

          return () => {
            state.context.node.removeEventListener("click", cb);
          };
        }
      }
    }, [onPick, state]);

    useEffect(() => {
      switch (state.type) {
        case Type.Idle:
          return undefined;
        case Type.Loading:
        case Type.Active: {
          setScroll(scrollValue(state));
          const scroll$ = fromEvent(window, "scroll")
            .pipe(
              debounceTime(100),
              map(() => scrollValue(state))
            )
            .subscribe(setScroll);
          const color$ = from(browserSupports())
            .pipe(
              switchMap(() => {
                return from(
                  makeNodeScreenshot(state.context.node, config, {
                    maxWidth: 10000
                  })
                ).pipe(
                  switchMap(({ src }) => {
                    const image = document.createElement("img");
                    image.src = src;

                    return fromEvent(image, "load").pipe(
                      map(() => {
                        const canvasWidth = image.width;
                        const canvasHeight = image.height;

                        const canvas = document.createElement("canvas");
                        const c2d = canvas.getContext("2d");

                        canvas.width = canvasWidth;
                        canvas.height = canvasHeight;
                        c2d?.drawImage(image, 0, 0, canvasWidth, canvasHeight);

                        return c2d;
                      })
                    );
                  })
                );
              }),
              filter(isT),
              catchError(always(EMPTY))
            )
            .subscribe((c2d) =>
              setState(State.active({ ...state.context, c2d }))
            );

          return () => {
            scroll$.unsubscribe();
            color$.unsubscribe();
          };
        }
      }
    }, [state, config]);

    switch (state.type) {
      case Type.Idle:
        return null;
      case Type.Loading:
      case Type.Active:
        return createPortal(
          <div
            onClick={preventClick}
            onMouseMove={setCoords}
            className={classNames(nodeClasses[state.type])}
            ref={ref}
          >
            <span
              style={{
                transform: `translate(${coordsRef.current.x}px, ${coordsRef.current.y}px)`
              }}
              className={"brz-ed-eyeDropper--cursor"}
              ref={pointerRef}
            >
              <EditorIcon className={"icon"} icon={"eye-dropper"} />
            </span>
          </div>,
          document.body
        );
    }
  }
);
