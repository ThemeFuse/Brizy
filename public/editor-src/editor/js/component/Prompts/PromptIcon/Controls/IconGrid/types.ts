import { Icon } from "visual/config/icons/Icon";
import { IconData } from "../types";

export interface Props {
  icons: Icon[];
  value: Partial<IconData>;
  onChange: (icon: IconData) => void;
}
