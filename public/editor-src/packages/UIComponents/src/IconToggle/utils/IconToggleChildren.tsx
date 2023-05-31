import React, { ReactElement } from "react";
import { IconsName } from "../../EditorIcon/types";
import { NonEmptyArray } from "../../types/array";
import { Literal } from "../../types/literal";
import { IconToggleItem, Props as ItemProps } from "../IconToggleItem";

const choices = [
  { icon: IconsName.TextAlignLeft, title: "Align left", value: "left" },
  { icon: IconsName.TextAlignCenter, title: "Align center", value: "center" },
  { icon: IconsName.TextAlignRight, title: "Align right", value: "right" }
];

export const children = choices.map(({ icon, value, title }, i) => (
  <IconToggleItem<Literal> key={i} value={value} icon={icon} title={title} />
)) as NonEmptyArray<ReactElement<ItemProps<Literal>>>;
