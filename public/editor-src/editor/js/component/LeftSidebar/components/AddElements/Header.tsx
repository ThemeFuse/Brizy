import React, { ReactElement, useCallback, useState } from "react";
import { t } from "visual/utils/i18n";

export interface Props {
  children: ReactElement;
}

export const Header = (props: Props): ReactElement => {
  const { children } = props;
  const [edit, setEdit] = useState(false);

  const renderHeader = useCallback(() => {
    return (
      <div
        className="brz-ed-sidebar__edit-button"
        onClick={(): void => setEdit(!edit)}
      >
        {edit ? t("Done") : t("Edit")}
      </div>
    );
  }, [edit]);

  return React.cloneElement(children, {
    renderExtraHeader: renderHeader,
    isEditMode: edit
  });
};
