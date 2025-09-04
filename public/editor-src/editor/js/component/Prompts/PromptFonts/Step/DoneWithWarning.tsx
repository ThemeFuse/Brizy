import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Button } from "visual/component/Prompts/common/Button";
import { t } from "visual/utils/i18n";
import { FCC } from "visual/utils/react/types";

interface Props {
  onDone: VoidFunction;
}

export const DoneWithWarning: FCC<Props> = ({ children, onDone }) => (
  <div className="brz-ed-popup-integrations-step brz-ed-popup-integrations-step__done">
    <div className="brz-ed-popup-integrations-step__done-icon brz-ed-popup-integrations-step__warning-icon">
      <EditorIcon icon="nc-warning" />
    </div>
    <div className="brz-ed-popup-integrations-step__done-content">
      <p className="brz-p">{children}</p>
    </div>
    <Button color="teal" onClick={onDone}>
      {t("Done")}
    </Button>
  </div>
);
