import React, { ReactElement } from "react";
import { EditorIcon } from "visual/component/EditorIcon";
import { WithClassName, WithValue } from "visual/utils/options/attributes";

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
