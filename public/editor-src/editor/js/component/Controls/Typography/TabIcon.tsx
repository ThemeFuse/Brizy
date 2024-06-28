import classnames from "classnames";
import React from "react";
import EditorIcon from "visual/component/EditorIcon";

interface IconProps {
  icon: string;
  active: boolean;
  onClick: (icon: string) => void;
}
export const Icon = ({ icon, active, onClick }: IconProps): JSX.Element => {
  const className = classnames("brz-ed-control__tab__icon", {
    active
  });
  return (
    <div className={className} onClick={() => onClick(icon)}>
      <EditorIcon icon={icon} />
    </div>
  );
};
