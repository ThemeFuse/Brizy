import React, { ReactElement } from "react";
import { t } from "visual/utils/i18n";
import EditorIcon from "visual/component/EditorIcon";

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
