import React, { ReactElement, useCallback, useState } from "react";
import EditorIcon from "visual/component/EditorIcon";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";

export interface Props {
  children: ReactElement;
}

export const Header = (props: Props): ReactElement => {
  const { children } = props;
  const [isEdit, setEdit] = useState(false);

  const _config = Config.getAll();
  const helpIcon = _config?.ui?.help?.showIcon;

  const handleChange = useCallback(() => {
    setEdit((isEdit) => !isEdit);
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <div className="brz-ed-sidebar__edit-elements">
        <div className="brz-ed-sidebar__elements--icon" onClick={handleChange}>
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
        {helpIcon && (
          <div className="brz-ed-sidebar__elements--icon">
            <span title={t("Help")}>
              <EditorIcon icon={"nc-alert-circle-que"} />
            </span>
          </div>
        )}
      </div>
    );
  }, [isEdit, handleChange, helpIcon]);

  return React.cloneElement(children, {
    renderExtraHeader: renderHeader,
    isEditMode: isEdit
  });
};
