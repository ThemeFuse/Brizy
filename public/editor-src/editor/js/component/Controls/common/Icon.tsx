import React, { useCallback } from "react";
import { FatCheckIcon } from "visual/component/Controls/FatCheckIcon";
import { OnChange } from "visual/component/Options/Type";
import { Literal } from "visual/utils/types/Literal";

export interface Props<T> {
  active: boolean;
  checked: boolean;
  id: T;
  icon: string;
  label: string;
  onClick: OnChange<T>;
  onCheck: OnChange<T>;
}

export const Icon = <T extends Literal>({
  active,
  onClick,
  checked,
  onCheck,
  label,
  icon,
  id
}: Props<T>): JSX.Element => {
  const _onClick = useCallback<VoidFunction>(() => onClick(id), [onClick, id]);
  const _onCheck = useCallback<VoidFunction>(() => onCheck(id), [onCheck, id]);

  return (
    <FatCheckIcon
      active={active}
      icon={icon}
      label={label}
      onClick={_onClick}
      checked={checked}
      onCheck={_onCheck}
    />
  );
};
