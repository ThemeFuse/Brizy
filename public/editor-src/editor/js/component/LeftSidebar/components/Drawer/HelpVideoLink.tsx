import { HelpVideo, foundUrl } from "@brizy/builder-ui-components";
import React, { useCallback, useMemo, useState } from "react";
import { TooltipIcon } from "visual/component/Controls/LeftSidebar/AddElements";
import { HelpVideos } from "visual/global/Config/types/configs/ConfigCommon";
import { useConfig } from "visual/providers/ConfigProvider";
import { useTranslation } from "visual/providers/I18nProvider";

interface HelpVideoLinkProps {
  videoKey: HelpVideos;
}

export function HelpVideoLink({ videoKey }: HelpVideoLinkProps) {
  const { t } = useTranslation();
  const [opened, setOpen] = useState(false);
  const handleClick = useCallback(() => setOpen((v) => !v), []);
  const config = useConfig();
  const { video, idHelpVideosIcons } = config?.ui?.help ?? {};

  const { dataLinks, idVideoAddElements } = useMemo(
    () => ({
      dataLinks: video ?? [],
      idVideoAddElements: idHelpVideosIcons?.[videoKey]
    }),
    [video, idHelpVideosIcons, videoKey]
  );

  const url = useMemo(
    () => foundUrl(dataLinks, idVideoAddElements),
    [dataLinks, idVideoAddElements]
  );

  return (
    <>
      {dataLinks && idVideoAddElements && (
        <TooltipIcon
          icon="nc-alert-circle-que"
          overlayText={t("Help")}
          onClick={handleClick}
        />
      )}
      {url && opened && <HelpVideo opened onClose={handleClick} url={url} />}
    </>
  );
}
