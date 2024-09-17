import React, { ReactNode } from "react";
import {
  makeEndPlaceholder,
  makePlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";
import cn from "classnames";
import { FCC } from "visual/utils/react/types";

interface Props {
  menuId: string;
  children: ReactNode;
}

export const Li: FCC<Props> = (props) => {
  const { children, menuId } = props;

  const startMenuLoop = makeStartPlaceholder({
    content: "{{ menu_loop }}",
    attr: { menuId }
  });
  const endMenuLoop = makeEndPlaceholder({
    content: "{{ end_menu_loop }}"
  });
  const menuItemId = makePlaceholder({
    content: "{{ menu_item_uid }}"
  });
  const className = cn(
    "brz-menu__item",
    makePlaceholder({ content: "{{ menu_item_classname }}" })
  );

  return (
    <>
      {startMenuLoop}
      <li data-menu-item-id={menuItemId} className={className}>
        {children}
      </li>
      {endMenuLoop}
    </>
  );
};
