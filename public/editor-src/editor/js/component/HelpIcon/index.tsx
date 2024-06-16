import { HelpVideo } from "@brizy/builder-ui-components";
import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

interface Props {
  handleHelpIconClick: () => void;
  url: string;
  iconClassName?: string;
  containerClassName: string;
  isHelpVideoOpened: boolean;
}

const HelpIcon = ({
  handleHelpIconClick,
  url,
  iconClassName,
  containerClassName,
  isHelpVideoOpened
}: Props): ReactElement => (
  <>
    <div className={containerClassName} onClick={handleHelpIconClick}>
      <span title={t("Help")}>
        <EditorIcon className={iconClassName} icon={"nc-help"} />
      </span>
    </div>
    {url && isHelpVideoOpened && (
      <HelpVideo opened onClose={handleHelpIconClick} url={url} />
    )}
  </>
);

export default HelpIcon;
