import { setIn } from "timm";
import { hexToRgba, getColorPaletteColor } from "visual/utils/color";
import { encodeToString } from "visual/utils/string";
import { t } from "visual/utils/i18n";

const getColorValue = ({ hex, opacity }) => hexToRgba(hex, opacity);

const getPopulationColor = (populationColor, type, value) => {
  if (value.isChanged === "hex") {
    const newValue = setIn(populationColor, [type, "hex"], value.hex);
    return encodeToString(setIn(newValue, [type, "colorPalette"], null));
  }

  if (value.isChanged === "opacity") {
    return encodeToString(
      setIn(populationColor, [type, "opacity"], value.opacity)
    );
  }

  const newValue = setIn(populationColor, [type, "colorPalette"], value);
  return encodeToString(setIn(newValue, [type, "hex"], null));
};

const getColor = value => {
  if (value.isChanged === "hex") {
    return {
      color: value.hex,
      colorPalette: null
    };
  }

  if (value.isChanged === "opacity") {
    return { opacity: value.opacity };
  }

  return {
    color: null,
    colorPalette: value
  };
};

function getPopulationTabs({ populationColor }, onChange) {
  const translationsMap = {
    p: t("P"),
    h1: t("H1"),
    h2: t("H2"),
    h3: t("H3"),
    h4: t("H4"),
    h5: t("H5"),
    h6: t("H6")
  };

  return Object.entries(populationColor).reduce((acc, [key, headerValue]) => {
    const { hex: hexPalette } =
      getColorPaletteColor(headerValue.colorPalette) || {};
    acc.push({
      label: translationsMap[key],
      options: [
        {
          id: "paragraphColor",
          type: "colorPicker",
          position: 10,
          value: {
            hex: hexPalette || headerValue.hex,
            opacity: headerValue.opacity
          },
          onChange: value =>
            onChange({
              populationColor: getPopulationColor(populationColor, key, value)
            })
        },
        {
          id: "paragraphColorPalette",
          type: "colorPalette",
          position: 20,
          value: headerValue.colorPalette,
          onChange: value =>
            onChange({
              populationColor: getPopulationColor(populationColor, key, value)
            })
        },
        {
          type: "grid",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              width: 100,
              options: [
                {
                  id: "paragraphColorFields",
                  type: "colorFields",
                  position: 30,
                  value: {
                    hex: hexPalette || headerValue.hex,
                    opacity: headerValue.opacity
                  },
                  onChange: value =>
                    onChange(getPopulationColor(populationColor, key, value))
                }
              ]
            }
          ]
        }
      ]
    });

    return acc;
  }, []);
}

function getPopulationColorOptions({ populationColor }, onChange) {
  return [
    {
      id: "color",
      tabsPosition: "left",
      type: "tabs",
      tabs: [
        {
          tabIcon: "nc-circle",
          title: t("Normal"),
          options: [
            {
              id: "colorTabs",
              className: "",
              type: "tabs",
              tabs: getPopulationTabs({ populationColor }, onChange)
            }
          ]
        }
      ]
    }
  ];
}

function getSimpleColorOptions({ color, colorPalette }, onChange) {
  return [
    {
      id: "color",
      type: "colorPicker",
      position: 10,
      value: color,
      onChange: value => onChange(getColor(value))
    },
    {
      type: "grid",
      className: "brz-ed-grid__color-fileds",
      columns: [
        {
          width: 100,
          options: [
            {
              id: "bgColorFields",
              type: "colorFields",
              position: 30,
              value: {
                ...color
              },
              onChange: value => onChange(getColor(value))
            }
          ]
        }
      ]
    },
    {
      id: "bgColorPalette",
      type: "colorPalette",
      position: 20,
      value: colorPalette,
      onChange: value => onChange(getColor(value))
    }
  ];
}

const getColorToolbar = (
  { color, populationColor, colorPalette, isPopulationBlock },
  onChange
) => {
  return {
    id: "toolbarColor",
    type: "popover",
    size: "auto",
    title: t("Colors"),
    roles: ["admin"],
    position: 20,
    icon: {
      style: {
        backgroundColor: getColorValue(color)
      }
    },
    options: isPopulationBlock
      ? getPopulationColorOptions({ populationColor }, onChange)
      : getSimpleColorOptions({ color, colorPalette }, onChange)
  };
};

export default getColorToolbar;
