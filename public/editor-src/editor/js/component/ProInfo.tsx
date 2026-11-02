import React, { type ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

export type Props = {
  text: string;
  url: string;
};

export const ProInfo = ({ text, url }: Props): ReactElement => {
  return (
    <div className="brz-ed-tooltip-content__pro">
      <p className="brz-p brz-ed-tooltip-content__pro-title">{text}</p>
      <p className="brz-p brz-ed-tooltip-content__pro-body">
        <a
          className="brz-a"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <EditorIcon icon="nc-lock" />
          {t("Get a PRO plan")}
        </a>
      </p>
    </div>
  );
};
