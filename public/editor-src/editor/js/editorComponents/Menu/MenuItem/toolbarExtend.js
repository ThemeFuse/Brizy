import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { MOBILE } from "visual/utils/responsiveMode";

const getItems =
  (mode, isMMenu) =>
  ({ v, device }) => {
    const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });
    const disabledOffset =
      isMMenu || (mode === "vertical" && device === MOBILE);
    const disabledPlacement = isMMenu || mode === "vertical";

    return [
      {
        id: "megaMenuPlacement",
        type: "toggle",
        position: 100,
        disabled: disabledPlacement,
        choices: [
          {
            icon: "nc-text-align-left",
            title: t("Align"),
            value: "bottom-start"
          },
          {
            icon: "nc-text-align-center",
            title: t("Align"),
            value: "bottom"
          },
          {
            icon: "nc-text-align-right",
            title: t("Align"),
            value: "bottom-end"
          }
        ]
      },
      {
        id: "toolbarSettings",
        type: "popover",
        config: {
          title: t("Settings")
        },
        position: 110,
        options: [
          {
            id: "megaMenuWidth",
            position: 10,
            label: t("Width"),
            type: "slider",
            disabled: isMMenu,
            config: {
              min: 35,
              max: dvv("megaMenuWidthSuffix") === "px" ? 1170 : 100,
              inputMin: 35,
              units: [
                { title: "%", value: "%" },
                { title: "px", value: "px" },
                { title: "vw", value: "vw" }
              ]
            }
          },
          {
            id: "megaMenuOffsetTop",
            position: 30,
            label: t("Offset"),
            type: "slider",
            disabled: disabledOffset,
            config: {
              min: 0,
              max: 100,
              inputMin: 0,
              inputMax: 100,
              units: [{ title: "px", value: "px" }]
            }
          }
        ]
      }
    ];
  };

export default (...args) => ({ getItems: getItems(...args) });
