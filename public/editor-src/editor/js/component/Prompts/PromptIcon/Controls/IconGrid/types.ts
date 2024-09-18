import { Icon } from "visual/config/icons/Icon";
import { IconData } from "../types";

export interface Props {
  icons: Icon[];
  value: IconData;
  onChange: (icon: IconData) => void;
}
