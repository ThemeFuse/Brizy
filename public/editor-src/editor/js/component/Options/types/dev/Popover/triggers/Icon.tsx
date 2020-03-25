import React, { FC } from "react";
import EditorIcon from "visual/component/EditorIcon";

type Props = {
  icon: string;
};

export const Icon: FC<Props> = ({ icon }) => <EditorIcon icon={icon} />;
