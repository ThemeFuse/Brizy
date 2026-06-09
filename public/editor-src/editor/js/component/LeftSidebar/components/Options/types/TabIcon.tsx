import classNames from "classnames";
import React from "react";
import Icon from "../../Icon";

interface TabIconProps {
  id: string;
  icon?: string;
  iconComponent?: React.ComponentType;
  title?: string;
  active?: boolean;
  onClick?: () => void;
}

function TabIcon({ id, icon, iconComponent: IconComponent, title, active, onClick }: TabIconProps) {
  if (IconComponent) {
    return (
      <div
        className={classNames(
          "brz-li brz-ed-sidebar__control__item",
          { "brz-ed-sidebar__control__item--active": active }
        )}
        title={title}
        onClick={onClick}
        data-plugin-id={id}
      >
        <IconComponent />
      </div>
    );
  }

  return (
    <Icon
      id={id}
      icon={icon ?? ""}
      title={title}
      active={active}
      onClick={onClick}
    />
  );
}

export default TabIcon;
