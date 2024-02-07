import classNames from "classnames";
import React, {
  CSSProperties,
  ForwardRefRenderFunction,
  ReactElement,
  forwardRef,
  useCallback
} from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Props } from "./types";
import { getThumbStyles, getViewStyles, wrapperStyles } from "./utils";

const _Scrollbar: ForwardRefRenderFunction<Scrollbars, Props> = (
  { children, theme, autoHeightMax, className },
  ref
) => {
  const viewClasName = classNames("brz-scrollbar__view", className);
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
        className={viewClasName}
      />
    ),
    [autoHeightMax, viewClasName]
  );

  return (
    <Scrollbars
      ref={ref}
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

export const Scrollbar = forwardRef<Scrollbars, Props>(_Scrollbar);
