import React from "react";
import EditorIcon from "visual/component/EditorIcon";
import { IconProps } from "./types";
import { JSX } from "react";

export const Icon = ({ icon }: IconProps): JSX.Element => (
  <div className="brz-ed-option__icon">
    <EditorIcon icon={icon} />
  </div>
);
