import { CustomIcon } from "visual/config/icons/Icon";

export interface Props {
  icons: CustomIcon[];
  name?: string;
  onChange: (v: CustomIcon) => void;
  canUpload?: boolean;
  onRemove?: (id: number) => void;
}
