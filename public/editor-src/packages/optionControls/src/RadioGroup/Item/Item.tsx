import React from "react";
import { EditorIcon } from "../../EditorIcon";
import { ItemProps } from "../types";

export function Item({ icon }: ItemProps) {
  return <EditorIcon icon={icon} />;
}
