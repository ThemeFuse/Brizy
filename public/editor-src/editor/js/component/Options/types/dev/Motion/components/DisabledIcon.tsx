import React, { ReactElement } from "react";
import { FatCheckIcon } from "visual/component/Controls/FatCheckIcon";

export interface Props {
  icon: string;
  label: string;
}

export function DisabledIcon({ label, icon }: Props): ReactElement {
  return <FatCheckIcon icon={icon} label={label} disabled={true} />;
}
