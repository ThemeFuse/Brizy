import React, { type ReactElement } from "react";
import { EditorIcon } from "visual/component/EditorIcon";
import type { Literal } from "visual/utils/types/Literal";

export type Props<T extends Literal> = {
  icon: string;
  title?: string;
  value: T;
  active: boolean;
};

export function Item<T extends Literal>({ icon }: Props<T>): ReactElement {
  return <EditorIcon icon={icon} />;
}
