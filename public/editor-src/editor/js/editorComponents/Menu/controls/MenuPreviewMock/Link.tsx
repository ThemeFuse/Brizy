import React, { ReactElement } from "react";
import { makePlaceholder } from "visual/utils/dynamicContent";

export interface Props {
  menuId: string;
}
export const Link = (): ReactElement => {
  const icon = makePlaceholder({
    content: "{{ menu_item_icon }}"
  });
  const title = makePlaceholder({
    content: "{{ menu_item_title }}"
  });
  const titleAttr = makePlaceholder({
    content: "{{ menu_item_attr_title }}"
  });
  const href = makePlaceholder({
    content: "{{ menu_item_href }}"
  });
  const target = makePlaceholder({
    content: "{{ menu_item_target }}"
  });

  return (
    <a className="brz-a" target={target} href={href} title={titleAttr}>
      {icon}
      <span className="brz-span" dangerouslySetInnerHTML={{ __html: title }} />
    </a>
  );
};
