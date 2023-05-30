import React, { CSSProperties, ReactElement, useCallback } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Props } from "./types";
import { getThumbStyles, getViewStyles, wrapperStyles } from "./utils";

export const Scrollbar: React.FC<Props> = ({
  children,
  theme,
  autoHeightMax
}) => {
  const renderThumbs = useCallback(
    (props: { style: CSSProperties }): ReactElement => (
      <div
        className={`brz-scrollColor__${theme}`}
        {...props}
        style={{ ...props.style, ...getThumbStyles }}
      />
    ),
    [theme]
  );
  const renderView = useCallback(
    (props: { style: CSSProperties }): ReactElement => (
      <div
        {...props}
        style={{
          ...props.style,
          ...getViewStyles,
          ...(autoHeightMax !== undefined && { maxHeight: autoHeightMax })
        }}
        className="brz-scrollbar__view"
      />
    ),
    [autoHeightMax]
  );

  return (
    <Scrollbars
      className="brz-scrollbar__wrapper"
      style={wrapperStyles}
      renderThumbHorizontal={renderThumbs}
      renderThumbVertical={renderThumbs}
      renderView={renderView}
      autoHeight={!!autoHeightMax}
      autoHeightMax={autoHeightMax}
    >
      {children}
    </Scrollbars>
  );
};
