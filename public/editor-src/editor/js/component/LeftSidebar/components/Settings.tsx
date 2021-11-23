import React, { ReactNode, ReactElement, useState } from "react";
import Config from "visual/global/Config";
import { PromptThirdParty } from "visual/component/Prompts/PromptThirdParty";
import Link from "./Options/types/Link";
import { t } from "visual/utils/i18n";
import { Cloud, isCloud } from "visual/global/Config/types/configs/Cloud";

interface Props {
  config: Cloud;
}

const SettingComponent = ({ config }: Props): ReactElement => {
  const [opened, setOpened] = useState(false);

  const {
    urls: { projectSettings }
  } = config;

  const onClick = (): void => setOpened(!opened);
  const onClose = (): void => setOpened(false);

  return (
    <>
      <Link
        className="brz-ed-sidebar__control__item"
        icon="nc-cog"
        title={t("Settings")}
        onClick={onClick}
      />
      <PromptThirdParty
        iframeSrc={projectSettings}
        opened={opened}
        onClose={onClose}
      />
    </>
  );
};

const _SettingComponent = (): ReactNode => {
  const config = Config.getAll();

  return isCloud(config) ? <SettingComponent config={config} /> : null;
};

export const Settings = {
  id: "settings",
  type: "custom",
  Component: _SettingComponent
};
