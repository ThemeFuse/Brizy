import classNames from "classnames";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState
} from "react";
import { usePopper } from "react-popper";
import ClickOutside from "visual/component/ClickOutside";
import { makeAttr } from "visual/utils/i18n/attribute";
import { attachRef } from "visual/utils/react";
import { type Props, TooltipImperativeProps } from "./types";
import { TOOLTIP_OUTSIDE_EXCEPTIONS } from "./utils";

export const Tooltip = forwardRef<TooltipImperativeProps, Props>(
  (
    { overlay, offset, placement, className, contentRef, id, referenceElement },
    ref
  ) => {
    const [isOpened, setIsOpened] = useState(false);
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(
      null
    );

    const [arrowElement, setArrowElement] = useState<HTMLElement | null>(null);

    const { attributes, styles, ...popper } = usePopper(
      referenceElement,
      popperElement,
      {
        placement,
        modifiers: [
          {
            name: "offset",
            options: { offset: [0, offset] }
          },
          {
            name: "flip",
            options: {
              fallbackPlacements: ["auto", "auto-start", "auto-end"]
            }
          },
          {
            name: "arrow",
            options: { element: arrowElement, padding: 5 }
          }
        ]
      }
    );

    const handleUpdate = useCallback(() => {
      // Extract `update` here so the callback always uses the latest function, since it won’t retrigger otherwise
      const { update } = popper;
      if (update) {
        update();
      }
    }, [popper]);

    const handleRef = useCallback(
      (el: HTMLDivElement | null) => {
        setPopperElement(el);
        attachRef(el, contentRef);
      },
      [contentRef]
    );

    const handleOpen = useCallback(() => {
      setIsOpened(true);
    }, []);
    const handleClose = useCallback(() => setIsOpened(false), []);
    const handleToggle = useCallback(() => setIsOpened((v) => !v), []);

    useImperativeHandle(
      ref,
      () => ({
        updatePopper: handleUpdate,
        openTooltip: handleOpen,
        toggleTooltip: handleToggle
      }),
      [handleOpen, handleToggle, handleUpdate]
    );
    const _className = classNames(
      "brz-tooltip",
      { "brz-invisible": !isOpened },
      className
    );

    const _clickOutSideExceptions = useMemo(
      () => [
        ...TOOLTIP_OUTSIDE_EXCEPTIONS,
        `[${makeAttr("tooltip-wrapper-id")}='${id}']`
      ],
      [id]
    );

    return (
      <ClickOutside
        exceptions={_clickOutSideExceptions}
        onClickOutside={handleClose}
      >
        {({ ref: clickOutsideRef }) => (
          <div
            ref={(el) => {
              handleRef(el);
              attachRef(el, clickOutsideRef);
            }}
            style={styles.popper}
            {...attributes.popper}
            className={_className}
          >
            {isOpened && overlay}
            <div
              ref={setArrowElement}
              style={styles.arrow}
              {...attributes.arrow}
              className="brz-tooltip--arrow"
            />
          </div>
        )}
      </ClickOutside>
    );
  }
);
