import { IconUploadData } from "visual/global/Config/types/configs/common";
import { CustomIcon } from "visual/config/icons/Icon";
import { IconTypes } from "visual/config/icons/Type";

export const normalizeCustomIcons = ({
  name,
  filename
}: IconUploadData): CustomIcon => ({
  name,
  filename,
  type: IconTypes.Custom
});
