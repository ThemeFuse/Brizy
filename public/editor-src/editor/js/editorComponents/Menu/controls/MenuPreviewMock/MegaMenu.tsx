import React, { ReactElement } from "react";
import { makePlaceholder } from "visual/utils/dynamicContent";

export const MegaMenu = (): ReactElement => {
  const megaMenu = makePlaceholder({
    content: "{{ mega_menu }}"
  });

  return <>{megaMenu}</>;
};
