import React, { CSSProperties, FC, ReactElement, useMemo } from "react";
import Scrollbars from "react-custom-scrollbars";
import { Props } from "./types";

export const Scrollbar: FC<Props> = ({ children, theme }) => {
  const renderThumbs = useMemo(() => {
    const _renderThumbs = (props: { style: CSSProperties }): ReactElement => {
      return (
        <div
          className={`brz-scrollColor__${theme}`}
          {...props}
          style={{ ...props.style, borderRadius: "inherit" }}
        />
      );
    };

    return _renderThumbs;
  }, [theme]);

  return (
    <Scrollbars
      renderThumbHorizontal={renderThumbs}
      renderThumbVertical={renderThumbs}
    >
      {children}
    </Scrollbars>
  );
};
