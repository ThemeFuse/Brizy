import React, { type ReactElement } from "react";
import { EditorIcon } from "visual/component/EditorIcon";
import type { WithClassName, WithValue } from "visual/types/attributes";

export type Props<T> = WithClassName &
  WithValue<T> & {
    icon: string;
    title: string;
  };

export function IconToggleItem<T>({
  className,
  icon
}: Props<T>): ReactElement<Props<T>> {
  return <EditorIcon className={className} icon={icon} />;
}

export default IconToggleItem;
