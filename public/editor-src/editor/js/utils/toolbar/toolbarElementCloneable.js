import { t } from "visual/utils/i18n";

export function toolbarElementCloneableSpacing({ v, position = 350 }) {
  return {
    id: "itemPadding",
    type: "slider",
    label: t("Spacing"),
    roles: ["admin"],
    position,
    slider: {
      min: 0,
      max: 100
    },
    input: {
      show: true
    },
    suffix: {
      show: true,
      choices: [
        {
          title: "px",
          value: "px"
        }
      ]
    },
    disabled: v.items.length === 1,
    value: {
      value: v.itemPadding
    },
    onChange: ({ value: itemPadding }) => {
      return {
        itemPadding,
        itemPaddingRight: itemPadding,
        itemPaddingLeft: itemPadding
      };
    }
  };
}
