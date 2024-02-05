import { HelpVideo, foundUrl } from "@brizy/builder-ui-components";
import React, { ReactElement, useCallback, useMemo, useState } from "react";
import EditorIcon from "visual/component/EditorIcon";
import Config from "visual/global/Config";
import { HelpVideos } from "visual/global/Config/types/configs/ConfigCommon";
import { t } from "visual/utils/i18n";

export interface Props {
  children: ReactElement;
}

export const Header = (props: Props): ReactElement => {
  const { children } = props;
  const { video, idHelpVideosIcons } = Config.getAll().ui?.help ?? {};

  const [isEdit, setEdit] = useState(false);
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

  const renderHeader = useCallback(() => {
    return (
      <>
        <div className="brz-ed-sidebar__edit-elements">
          <div
            className="brz-ed-sidebar__elements--icon"
            onClick={handleChange}
          >
            {isEdit ? (
              <span title={t("Done")}>
                <EditorIcon icon="nc-success" />
              </span>
            ) : (
              <span title={t("Edit")}>
                <EditorIcon icon="nc-pen" />
              </span>
            )}
          </div>
          {dataLinks && idVideoAddElements && (
            <div
              className="brz-ed-sidebar__elements--icon"
              onClick={handleClick}
            >
              <span title={t("Help")}>
                <EditorIcon icon={"nc-alert-circle-que"} />
              </span>
            </div>
          )}
        </div>
        {url && opened && <HelpVideo opened onClose={handleClick} url={url} />}
      </>
    );
  }, [
    isEdit,
    handleChange,
    dataLinks,
    handleClick,
    opened,
    url,
    idVideoAddElements
  ]);

  return React.cloneElement(children, {
    renderExtraHeader: renderHeader,
    isEditMode: isEdit
  });
};
