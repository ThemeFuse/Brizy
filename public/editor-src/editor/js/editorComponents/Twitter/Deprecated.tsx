import React from "react";
import { useTranslation } from "visual/providers/I18nProvider";

export const DeprecatedTwitter = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div>
      {t(
        "The Twitter embed has been deprecated. Please use the Twitter Follow Button instead."
      )}
    </div>
  );
};
