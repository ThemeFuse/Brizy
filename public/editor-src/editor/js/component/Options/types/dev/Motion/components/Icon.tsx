import React, { ReactElement, useCallback } from "react";
import { OnChange } from "visual/component/Options/Type";
import { FatCheckIcon } from "visual/component/Controls/FatCheckIcon";

export interface Props<T> {
  active: boolean;
  checked: boolean;
  id: T;
  icon: string;
  label: string;
  onClick: OnChange<T>;
  onCheck: OnChange<T>;
}

export function Icon<T>({
  active,
  onClick,
  checked,
  onCheck,
  label,
  icon,
  id
}: Props<T>): ReactElement {
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
}
