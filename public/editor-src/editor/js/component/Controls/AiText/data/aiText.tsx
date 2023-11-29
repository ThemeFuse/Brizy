import { Microphone, Multilanguage } from "@brizy/ui-icons";
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
    width: "97px"
  },
  {
    data: [
      {
        label: t("En"),
        action: "English"
      },
      {
        label: t("De"),
        action: "German"
      },
      {
        label: t("Fr"),
        action: "French"
      },
      {
        label: t("Es"),
        action: "Spanish"
      },
      {
        label: t("It"),
        action: "Italian"
      },
      {
        label: t("Nl"),
        action: "Dutch"
      },
      {
        label: t("Pt"),
        action: "Portuguese"
      },
      {
        label: t("Pl"),
        action: "Polish"
      }
    ],
    icon: <Icon source={Multilanguage} color="inherit" />,
    label: t("En"),
    width: "65px"
  }
];
