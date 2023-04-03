import { ReactElement } from "react";
import { IconsName } from "../EditorIcon/types";
import { WithClassName } from "../types/attributes";

export type ItemProps = {
  icon: IconsName;
  title?: string;
  value?: string;
  isActive?: boolean;
};

export interface Props extends WithClassName {
  children: ReactElement[];
  onChange: (v: string) => void;
  value?: string;
}
