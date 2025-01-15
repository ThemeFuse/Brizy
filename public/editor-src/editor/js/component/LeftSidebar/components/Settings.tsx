import React, { ReactElement, ReactNode, useState } from "react";
import { PromptThirdParty } from "visual/component/Prompts/PromptThirdParty";
import { Cloud, isCloud } from "visual/global/Config/types/configs/Cloud";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { useConfig } from "visual/global/hooks";
import { t } from "visual/utils/i18n";
import Link from "./Options/types/Link";

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

export const _SettingComponent = (): ReactNode => {
  const config = useConfig();

  return isCloud(config) ? <SettingComponent config={config} /> : null;
};

export const Settings = {
  id: LeftSidebarOptionsIds.settings,
  type: "custom",
  Component: _SettingComponent
};
