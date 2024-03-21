import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";

type Props = {
  icon: string;
};

export const Icon = ({ icon }: Props): ReactElement => (
  <EditorIcon icon={icon} />
);
