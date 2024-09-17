import React, { FC } from "react";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { Li } from "./Li";
import { Link } from "./Link";
import { MegaMenu } from "./MegaMenu";
import { Dropdown } from "./Dropdown";

export interface Props {
  menuId: string;
}

export const MenuPreviewMock: FC<Props> = (props) => {
  const { menuId } = props;
  const attr =
    TARGET === "WP"
      ? {
          className: "brz-menu__ul",
          "data-menu-items-active": makePlaceholder({
            content: "{{ editor_menu_active_item }}",
            attr: { menu: menuId }
          })
        }
      : { className: "brz-menu__ul" };

  return (
    <ul {...attr}>
      <Li menuId={menuId}>
        <Link />
        <MegaMenu />
        <Dropdown />
      </Li>
    </ul>
  );
};
