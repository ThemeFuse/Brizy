import React, { forwardRef } from "react";
import { useTranslation } from "visual/providers/I18nProvider";

export const DeprecatedComments = forwardRef<HTMLDivElement>(
  (_, ref): JSX.Element => {
    const { t } = useTranslation();

    return (
      <div ref={ref}>
        {t(
          "The Facebook Comments API has been deprecated. For more details, see the"
        )}
        <a
          href="https://developers.facebook.com/docs/plugins/comments"
          target="_blank"
          rel="noopener noreferrer"
        >
          &nbsp;{t("official announcement.")}
        </a>
      </div>
    );
  }
);
