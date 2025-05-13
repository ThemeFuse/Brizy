import { Extend } from "@brizy/ui-icons/lib/icons/Extend";
import { Shorten } from "@brizy/ui-icons/lib/icons/Shorten";
import { Spacing } from "@brizy/ui/es/Space/utils";
import { IconsName } from "@brizy/ui/lib/EditorIcon/types";
import React from "react";
import { EditorIcon } from "visual/component/Brizy-ui/EditorIcon";
import { Icon } from "visual/component/Brizy-ui/Icon";
import { Space } from "visual/component/Brizy-ui/Space";
import { t } from "visual/utils/i18n";
import { iconSpacing } from "../constants";
import { Action, action } from "../types";

const simplifyIconSpacing: Spacing = [0, 5, 0, 0];

export const getActions = (): Action[] => [
  {
    action: action.Extend,
    icon: (
      <Space spacing={iconSpacing}>
        <Icon source={Extend} color="inherit" />
      </Space>
    ),
    label: t("Extend")
  },
  {
    action: action.Shorten,
    icon: (
      <Space spacing={iconSpacing}>
        <Icon source={Shorten} color="inherit" />
      </Space>
    ),
    label: t("Shorten")
  },
  {
    action: action.Simplify,
    icon: (
      <Space spacing={simplifyIconSpacing}>
        <EditorIcon icon={IconsName.WandMagic} />
      </Space>
    ),
    label: t("Simplify")
  }
];
