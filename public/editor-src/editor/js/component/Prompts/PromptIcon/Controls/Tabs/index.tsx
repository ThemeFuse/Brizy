import { sortBy } from "es-toolkit";
import React from "react";
import { getTypes } from "visual/config/icons";
import { TypeId } from "visual/config/icons/Type";
import { isWp } from "visual/global/Config";
import { isPro } from "visual/utils/env";
import { FCC } from "visual/utils/react/types";
import { TabItem } from "./TabItem";
import { Props } from "./types";

export const Tabs: FCC<Props> = ({
  onClick,
  onClose,
  currentTypeId,
  config
}) => {
  const _isPro = isPro(config);
  const _isWp = isWp(config);
  const tabs = sortBy(getTypes(_isPro, _isWp), [(type) => type.id])
    .filter(
      (tab) =>
        // hide custom tab if get custom icons handler is not defined
        !(
          tab.id === TypeId.Custom &&
          typeof config.api?.customIcon?.get !== "function"
        )
    )
    .map(({ title, icon, id }) => (
      <TabItem
        title={title}
        icon={icon}
        key={id}
        active={id === currentTypeId}
        onClick={() => onClick(id)}
      />
    ));

  return (
    <div className="brz-ed-popup-header">
      <div className="brz-ed-popup-header__tabs">{tabs}</div>
      <div className="brz-ed-popup-btn-close" onClick={onClose} />
    </div>
  );
};
