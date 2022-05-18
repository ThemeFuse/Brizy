import React, { ReactElement } from "react";
import Toolbar from "visual/component/Toolbar";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar";

type Props = {
  toolbarConfig: PortalToolbarProps;
  style: "style-1" | "style-2";
  toolbarConfigIcon: PortalToolbarProps;
};

export const ActiveFilters = ({
  toolbarConfig,
  style,
  toolbarConfigIcon
}: Props): ReactElement => {
  const text = ["Dress", "Ones", "Twos", "Shoes"];

  return (
    <>
      {new Array(1).fill("").map(
        (_, i): ReactElement => (
          <div key={`tag-${i}`} className={"brz-filters__option"}>
            <div className={"brz-filters__tag"}>
              <Toolbar {...toolbarConfig}>
                <span className={"brz-filters__tag__text"}>{text[i]}</span>
              </Toolbar>
              {style === "style-1" && (
                <Toolbar {...toolbarConfigIcon}>
                  <div className={"brz-filters__tag__close-icon"}>
                    <ThemeIcon name="close" type="editor" />
                  </div>
                </Toolbar>
              )}
            </div>
          </div>
        )
      )}
    </>
  );
};
