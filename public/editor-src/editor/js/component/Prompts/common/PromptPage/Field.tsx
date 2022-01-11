import React, { FC, ReactElement } from "react";

interface Props {
  label: string;
  required: boolean;
}

export const Field: FC<Props> = ({
  children,
  label,
  required
}): ReactElement => {
  return (
    <div className="brz-ed-popup-integrations-step__fields-option brz-d-xs-flex brz-align-items-xs-center brz-justify-content-xs-between">
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
