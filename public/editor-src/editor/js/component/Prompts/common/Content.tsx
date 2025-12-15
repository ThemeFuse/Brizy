import classNames from "classnames";
import React, { ReactNode } from "react";
import { Alert } from "visual/component/Alert";
import { Spacer } from "visual/component/Controls/Spacer";
import { Scrollbar } from "visual/component/Scrollbar";
import { FCC } from "visual/utils/react/types";
import { Loading } from "./Loading";

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

      <Scrollbar autoHeight={true} autoHeightMax="100%" theme="light">
        {children}
      </Scrollbar>

      {footer && (
        <>
          <Spacer space="35px" />
          <div className={footerClassName}>{footer}</div>
        </>
      )}
    </div>
  );
};
