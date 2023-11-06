import classnames from "classnames";
import React, { FC, ReactElement } from "react";

interface Props {
  label: string;
  required: boolean;
  className?: string;
}

export const Field: FC<Props> = ({
  children,
  label,
  required,
  className: _className
}): ReactElement => {
  const className = classnames(
    "brz-ed-popup-integrations-step__fields-option brz-d-xs-flex brz-align-items-xs-center brz-justify-content-xs-between",
    _className
  );

  return (
    <div className={className}>
      <p className="brz-p">
        {label}
        {required ? (
          <strong className="brz-strong brz--required">*</strong>
        ) : null}
      </p>
      <div className="brz-ed-popup-integrations-step__field">{children}</div>
    </div>
  );
};
