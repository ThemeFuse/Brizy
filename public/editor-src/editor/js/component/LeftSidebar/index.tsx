import React, { useCallback, FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import ClickOutside from "visual/component/ClickOutside";
import PointerEvents from "visual/component/PointerEvents";
import { updateUI } from "visual/redux/actions2";
import items from "./items";
import DrawerOptions from "./components/Options";
import classnames from "classnames";
import { IS_CMS } from "visual/utils/env";
import { leftSidebarSelector } from "visual/redux/selectors";
import { IS_STORY } from "visual/utils/models";

export const LeftSidebar: FC = () => {
  const dispatch = useDispatch();

  const { drawerContentType, isOpen } = useSelector(leftSidebarSelector);

  const handleClickOutside = useCallback(
    () =>
      drawerContentType &&
      dispatch(
        updateUI("leftSidebar", {
          drawerContentType: null,
          isOpen: false
        })
      ),
    [drawerContentType]
  );

  const opened = drawerContentType === "cmsUi" && isOpen;

  const leftSidebarCssV2 = IS_CMS && !IS_STORY;

  return (
    <ClickOutside
      onClickOutside={handleClickOutside}
      exceptions={[
        ".brz-ed-sortable--empty",
        ".brz-ed-toolbar",
        ".brz-ed-fixed-bottom-panel"
      ]}
    >
      <PointerEvents>
        <div id="brz-ed-sidebar" className="brz-ed-sidebar">
          <div
            className={classnames("brz-ed-sidebar__control", {
              "brz-ed-sidebar__control-cms": leftSidebarCssV2,
              "brz-ed-sidebar__control-cms__opened": leftSidebarCssV2 && opened
            })}
          >
            <DrawerOptions
              className="brz-ed-sidebar__control--top"
              data={items.top}
            />
            <DrawerOptions
              className="brz-ed-sidebar__control--bottom"
              data={items.bottom}
            />
          </div>
        </div>
      </PointerEvents>
    </ClickOutside>
  );
};
