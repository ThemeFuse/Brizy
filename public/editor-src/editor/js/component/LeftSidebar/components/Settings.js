import React, { useState, useEffect, useRef } from "react";
import Config from "visual/global/Config";
import { PromptThirdParty } from "visual/component/Prompts/PromptThirdParty";
import Link from "./Options/types/Link";
import { t } from "visual/utils/i18n";

export const Settings = {
  id: "settings",
  type: "custom",
  Component: () => {
    const [opened, setOpened] = useState(false);
    const siteUrl = Config.get("urls").site;
    const projectId = Config.get("project").id;
    let iframeSrc = `${siteUrl}/projects/${projectId}/settings`;

    if (process.env.NODE_ENV === "development") {
      iframeSrc += `?X-AUTH-USER-TOKEN=${Config.get("accessToken")}`;
    }

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
  }
};
