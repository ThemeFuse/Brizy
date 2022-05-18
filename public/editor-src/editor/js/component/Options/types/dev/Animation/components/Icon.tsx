import React, { ReactElement, useCallback } from "react";
import { FatIcon } from "visual/component/Controls/FatIcon";
import { OnChange } from "visual/component/Options/Type";

export interface Props<T> {
  active: boolean;
  id: T;
  icon: string;
  label: string;
  onClick: OnChange<T>;
}

export function Icon<T>({
  active,
  onClick,
  label,
  icon,
  id
}: Props<T>): ReactElement {
  const _onClick = useCallback<VoidFunction>(() => onClick(id), [onClick, id]);
  return (
    <FatIcon active={active} icon={icon} label={label} onClick={_onClick} />
  );
}
