import React, { useState } from "react";
import Config from "visual/global/Config";
import { PromptThirdParty } from "visual/component/Prompts/PromptThirdParty";
import Link from "./Options/types/Link";
import { getStore } from "visual/redux/store";
import { pageSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { IS_EXTERNAL_POPUP } from "visual/utils/models";

const SettingComponent = () => {
  const [opened, setOpened] = useState(false);
  const siteUrl = Config.get("urls").site;
  const projectId = Config.get("project").id;
  const mode = Config.get("mode");
  const id = pageSelector(getStore().getState()).id;

  let iframeSrc = `${siteUrl}/projects/${projectId}/settings?${mode}_id=${id}`;

  return (
    <>
      <Link
        className="brz-ed-sidebar__control__item"
        icon="nc-cog"
        title={t("Settings")}
        onClick={() => setOpened(!opened)}
      />
      <PromptThirdParty
        iframeSrc={iframeSrc}
        opened={opened}
        onClose={() => setOpened(false)}
      />
    </>
  );
};

export const Settings = {
  id: "settings",
  type: "custom",
  disabled: IS_EXTERNAL_POPUP,
  Component: SettingComponent
};
