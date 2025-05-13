import { HelpVideo, foundUrl } from "@brizy/builder-ui-components";
import React, { ReactElement, useCallback, useMemo, useState } from "react";
import {
  HeaderIcon,
  TooltipIcon
} from "visual/component/Controls/LeftSidebar/AddElements";
import { HelpVideos } from "visual/global/Config/types/configs/ConfigCommon";
import { useConfig } from "visual/providers/ConfigProvider";
import { t } from "visual/utils/i18n";

export interface Props {
  children: ReactElement;
}

export const Header = (props: Props): ReactElement => {
  const { children } = props;

  const config = useConfig();

  const { video, idHelpVideosIcons } = config?.ui?.help ?? {};

  const [isEdit, setEdit] = useState(false);
  const [isPin, setPin] = useState(false);
  const [opened, setOpen] = useState(false);

  const handleClick = useCallback(() => setOpen((v) => !v), []);
  const { dataLinks, idVideoAddElements } = useMemo(
    () => ({
      dataLinks: video ?? [],
      idVideoAddElements: idHelpVideosIcons?.[HelpVideos.addElementsHelpVideo]
    }),
    [video, idHelpVideosIcons]
  );

  const url = useMemo(
    () => foundUrl(dataLinks ?? [], idVideoAddElements),
    [dataLinks, idVideoAddElements]
  );

  const handleChange = useCallback(() => {
    setEdit((isEdit) => !isEdit);
  }, []);

  const handleChangePin = useCallback(() => {
    setPin((isPin) => !isPin);
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <>
        <div className="brz-ed-sidebar__edit-elements">
          {!isPin && (
            <HeaderIcon
              onClick={handleChange}
              nonActiveIcon="nc-eye-ban-18"
              nonActiveText={t("Edit")}
              isActive={isEdit}
            />
          )}
          {!isEdit && (
            <HeaderIcon
              onClick={handleChangePin}
              nonActiveIcon="nc-sidebar-pin"
              nonActiveText={t("Pin Elements")}
              isActive={isPin}
            />
          )}
          {!isPin && !isEdit && dataLinks && idVideoAddElements && (
            <div
              className="brz-ed-sidebar__elements--icon"
              onClick={handleClick}
            >
              <TooltipIcon icon="nc-alert-circle-que" overlayText={t("Help")} />
            </div>
          )}
        </div>
        {url && opened && <HelpVideo opened onClose={handleClick} url={url} />}
      </>
    );
  }, [
    isEdit,
    isPin,
    handleChange,
    handleChangePin,
    dataLinks,
    handleClick,
    opened,
    url,
    idVideoAddElements
  ]);

  return React.cloneElement(children, {
    renderExtraHeader: renderHeader,
    isEditMode: isEdit,
    isPinMode: isPin
  });
};
