import classnames from "classnames";
import React, { FormEvent } from "react";
import { FCC } from "visual/utils/react/types";

interface Props {
  className?: string;
  attributes?: Record<string, unknown>;
  recaptcha?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}

export const Form: FCC<Props> = ({
  className,
  attributes,
  recaptcha,
  children,
  onSubmit
}) => (
  <form
    className={classnames("brz-form", className)}
    noValidate
    onSubmit={onSubmit}
    {...(attributes ?? {})}
  >
    {children}
    {recaptcha && (
      <div
        className="brz-g-recaptcha"
        data-sitekey={recaptcha}
        data-size="invisible"
        data-callback="brzFormV2Captcha"
      />
    )}
  </form>
);
