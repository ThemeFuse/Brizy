import React, { ReactElement } from "react";
import {
  makeEndPlaceholder,
  makePlaceholder,
  makeStartPlaceholder
} from "visual/utils/dynamicContent";

export const Dropdown = (): ReactElement => {
  const startSubMenuLoop = makeStartPlaceholder({
    content: "{{ menu_loop_submenu }}"
  });
  const endSubMenuLoop = makeEndPlaceholder({
    content: "{{ end_menu_loop_submenu }}"
  });
  const startLoop = makeStartPlaceholder({
    content: "{{ menu_loop }}",
    attr: { recursive: "1" }
  });
  const endLoop = makePlaceholder({
    content: "{{ end_menu_loop }}"
  });

  return (
    <>
      {startSubMenuLoop}
      <ul className="brz-menu__sub-menu">
        {startLoop}
        {endLoop}
      </ul>
      {endSubMenuLoop}
    </>
  );
};
