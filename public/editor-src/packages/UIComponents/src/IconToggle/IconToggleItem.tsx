import React, { ReactElement } from "react";
import { IconsName } from "../EditorIcon/types";
import { EditorIcon } from "../index";
import { WithClassName, WithValue } from "../types/attributes";

export type Props<T> = WithClassName &
  WithValue<T> & {
    icon: IconsName;
    title: string;
  };

export function IconToggleItem<T>({
  className,
  icon
}: Props<T>): ReactElement<Props<T>> {
  return <EditorIcon className={className} icon={icon} />;
}
