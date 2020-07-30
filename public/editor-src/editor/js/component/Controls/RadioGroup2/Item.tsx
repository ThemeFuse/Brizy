import React, { ReactElement } from "react";
import { EditorIcon } from "visual/component/EditorIcon";

export type Props<T> = {
  icon: string;
  title: string;
  value: T;
  active: boolean;
};

export function Item<T>({ icon }: Props<T>): ReactElement {
  return <EditorIcon icon={icon} />;
}
