import { getStore } from "visual/redux/store";
import { updateUI } from "visual/redux/actions2";

export const openPaletteSidebar = () => {
  getStore().dispatch(
    updateUI("leftSidebar", {
      isOpen: true,
      drawerContentType: "styling"
    })
  );
};
