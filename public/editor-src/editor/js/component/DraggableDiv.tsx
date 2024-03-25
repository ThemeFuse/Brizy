import React, { CSSProperties, ReactNode } from "react";
import classNames from "classnames";
import Draggable from "visual/component/Draggable";
import { WithClassName } from "visual/utils/options/attributes";
import { FCC } from "visual/utils/react/types";

export type Props = WithClassName & {
  onDragStart?: () => void;
  onDrag?: (delta: { deltaX: number; deltaY: number }) => void;
  onDragEnd?: () => void;
  exceptions?: string[];
  draggingCursor?: string;
  style?: CSSProperties;
};

export const DraggableDiv: FCC<Props> = ({
  className,
  style,
  children,
  ...other
}) => {
  return (
    <Draggable<HTMLDivElement> {...other}>
      {(ref, dragClass): ReactNode => {
        return (
          <div
            ref={ref}
            className={classNames("brz-ed-draggable", dragClass, className)}
            style={style}
          >
            {children}
          </div>
        );
      }}
    </Draggable>
  );
};
