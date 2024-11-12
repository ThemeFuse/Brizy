import React, { useMemo } from "react";
import _ from "underscore";
import { TypeId } from "visual/config/icons/Type";
import Config from "visual/global/Config";
import { FCC } from "visual/utils/react/types";
import { TabItem } from "./TabItem";
import { Props } from "./types";
import { getTypes } from "visual/config/icons";

export const Tabs: FCC<Props> = ({ onClick, onClose, currentTypeId }) => {
  const config = useMemo(() => Config.getAll(), []);
  const tabs = _.sortBy(getTypes(config), (type) => type.id)
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
