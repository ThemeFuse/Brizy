import { Microphone } from "@brizy/ui-icons/lib/icons/Microphone";
import React from "react";
import { Icon } from "visual/component/Brizy-ui/Icon";
import { DropdownButtonData } from "visual/component/Controls/AiText/types";
import { t } from "visual/utils/i18n";

export const data: DropdownButtonData[] = [
  {
    data: [
      { label: t("Professional"), action: "Professional" },
      { label: t("Casual"), action: "Casual" },
      { label: t("Confident"), action: "Confident" },
      { label: t("Friendly"), action: "Friendly" }
    ],
    icon: <Icon source={Microphone} color="inherit" />,
    label: t("Tone"),
    width: "fit-content"
  }
];
