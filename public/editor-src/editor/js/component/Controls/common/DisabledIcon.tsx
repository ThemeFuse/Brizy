import React from "react";
import { FatCheckIcon } from "visual/component/Controls/FatCheckIcon";
import { FCC } from "visual/utils/react/types";

export interface Props {
  icon: string;
  label: string;
}

export const DisabledIcon: FCC<Props> = ({ label, icon }) => (
  <FatCheckIcon icon={icon} label={label} />
);
