import React, { ReactNode } from "react";
import classNames from "classnames";
import Scrollbars from "react-custom-scrollbars";
import { Spacer } from "visual/component/Controls/Spacer";
import { Alert } from "visual/component/Alert";
import { Loading } from "./Loading";
import { FCC } from "visual/utils/react/types";

export interface Props {
  spacing?: boolean;
  height?: boolean;
  head?: string;
  loading?: boolean;
  error?: string;
  footer?: ReactNode;
  inlineFooter?: boolean;
}

export const Content: FCC<Props> = (props) => {
  const {
    head,
    loading,
    error,
    children,
    spacing = true,
    height = true,
    footer,
    inlineFooter
  } = props;
  const className = classNames("brz-ed-popup-content", {
    "brz-ed-popup-content--spacing": spacing,
    "brz-ed-popup-content--height": height
  });
  const footerClassName = classNames("brz-ed-popup-content__footer", {
    "brz-ed-popup-content__footer--inline": inlineFooter
  });

  if (loading) {
    return (
      <div className={className}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={className}>
      {head && (
        <>
          <div className="brz-ed-popup-content__head">
            <p className="brz-p">
              <strong className="brz-strong">{head}</strong>
            </p>
            <Spacer space="19px" />
          </div>
        </>
      )}

      {error && <Alert message={error} type="error" />}

      <Scrollbars
        autoHeight={true}
        autoHeightMax="100%"
        style={{ height: "auto" }}
      >
        {children}
      </Scrollbars>

      {footer && (
        <>
          <Spacer space="35px" />
          <div className={footerClassName}>{footer}</div>
        </>
      )}
    </div>
  );
};
