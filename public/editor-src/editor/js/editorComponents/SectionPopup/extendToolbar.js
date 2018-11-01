import { t } from "visual/utils/i18n";

export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarSettings",
      type: "popover",
      title: t("Settings"),
      position: 110,
      options: [
        {
          id: "containerSize",
          label: t("Width"),
          type: "slider",
          position: 100,
          slider: {
            min: 35,
            max: 100
          },
          input: {
            show: true,
            min: 35,
            max: 100
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.containerSize
          },
          onChange: ({ value: containerSize }) => ({
            containerSize
          })
        }
      ]
    }
  ];
}

export function getItemsForTablet(v) {
  return [];
}

export function getItemsForMobile(v) {
  return [];
}
