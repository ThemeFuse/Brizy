import React, { CSSProperties, ReactElement, useMemo } from "react";
import Scrollbars from "react-custom-scrollbars";

interface Props {
  theme: "dark" | "light";
  children: React.ReactNode;
}

export const Scrollbar: React.FC<Props> = ({ children, theme }) => {
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
