import type { CustomIcon } from "visual/config/icons/Icon";
import { IconTypes } from "visual/config/icons/Type";
import type { IconUploadData } from "visual/global/Config/types/configs/common";

export const normalizeCustomIcons = ({
  name,
  filename
}: IconUploadData): CustomIcon => ({
  name,
  filename,
  type: IconTypes.Custom
});
