import React, { forwardRef, JSX } from "react";
import { useTranslation } from "visual/providers/I18nProvider";

export const DeprecatedGroups = forwardRef<HTMLDivElement>(
  (_, ref): JSX.Element => {
    const { t } = useTranslation();

    return (
      <div ref={ref}>
        {t(
          "The Facebook Groups API has been deprecated. For more details, see the"
        )}
        <a
          href="https://developers.facebook.com/blog/post/2024/01/23/introducing-facebook-graph-and-marketing-api-v19/"
          target="_blank"
          rel="noopener noreferrer"
        >
          &nbsp;{t("official announcement.")}
        </a>
      </div>
    );
  }
);

export const DeprecatedButton = forwardRef<HTMLDivElement>(
  (_, ref): JSX.Element => {
    const { t } = useTranslation();

    return (
      <div ref={ref}>
        {t(
          "The Facebook Like Button API has been deprecated. For more details, see the"
        )}
        <a
          href="https://developers.facebook.com/docs/plugins/like-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          &nbsp;{t("official announcement.")}
        </a>
      </div>
    );
  }
);
