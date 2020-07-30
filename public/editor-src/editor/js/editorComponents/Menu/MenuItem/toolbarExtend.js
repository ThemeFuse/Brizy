import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { MOBILE } from "visual/utils/responsiveMode";

const getItems = (mode, isMMenu) => ({ v, device }) => {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const disabledOffset = isMMenu || (mode === "vertical" && device === MOBILE);

  return [
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "megaMenuWidth",
          position: 10,
          label: t("Width"),
          type: "slider-dev",
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
          position: 20,
          label: t("Offset"),
          type: "slider-dev",
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
