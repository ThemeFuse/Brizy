/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useCallback } from "react";
import { Dispatch } from "redux";
import { connect, ConnectedProps } from "react-redux";
import ClickOutside from "visual/component/ClickOutside";
import PointerEvents from "visual/component/PointerEvents";
import { updateUI, ActionUpdateUI } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import items from "./items";
import DrawerOptions from "./components/Options";

const LeftSidebar: React.FC<ConnectedProps<typeof connector>> = ({
  drawerContentType,
  onDrawerContentTypeChange
}) => {
  const handleClickOutside = useCallback(
    () => drawerContentType && onDrawerContentTypeChange(null, false),
    [drawerContentType]
  );

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
          <div className="brz-ed-sidebar__control">
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

const mapStateToProps = (state: ReduxState) => ({
  deviceMode: state.ui.deviceMode,
  drawerContentType: state.ui.leftSidebar.drawerContentType
});

type DrawerContentType = ReduxState["ui"]["leftSidebar"]["drawerContentType"];
type IsOpen = ReduxState["ui"]["leftSidebar"]["isOpen"];

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onDrawerContentTypeChange: (
    drawerContentType: DrawerContentType,
    isOpen: IsOpen
  ): ActionUpdateUI =>
    dispatch(
      updateUI("leftSidebar", {
        drawerContentType,
        isOpen
      })
    )
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(LeftSidebar);
