import React from "react";
import * as Color from "visual/component/Controls/ColorPickerSelect/entities";
import { t } from "visual/utils/i18n";
import { Item } from "../Select2/Item";
import { Meta, Type } from "./entities";

export const fromColorMeta = (m: Color.Meta): Meta => ({
  isChanged: m.isChanged === "select" ? "type" : m.isChanged,
  isChanging: m.isChanging
});

export const renderColorPickerItems = (
  none: boolean,
  animatedGradient: boolean
) => {
  const items = [];
  none &&
    items.push(
      <Item<Type> key="none" value="none">
        {t("None")}
      </Item>
    );
  items.push(
    <Item<Type> key="solid" value="solid">
      {t("Solid")}
    </Item>
  );
  items.push(
    <Item<Type> key="gradient" value="gradient">
      {t("Gradient")}
    </Item>
  );
  animatedGradient &&
    items.push(
      <Item<Type> key="animated-gradient" value="animated-gradient">
        {t("Animated Gradient")}
      </Item>
    );
  return items;
};
