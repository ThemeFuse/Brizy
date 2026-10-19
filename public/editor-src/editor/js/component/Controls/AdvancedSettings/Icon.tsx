import React, { type JSX } from "react";
import EditorIcon from "visual/component/EditorIcon";
import type { IconProps } from "./types";

export const Icon = ({ icon }: IconProps): JSX.Element => (
  <div className="brz-ed-option__icon">
    <EditorIcon icon={icon} />
  </div>
);
