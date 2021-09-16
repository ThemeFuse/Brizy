import { ToastNotification } from "visual/component/Notifications";
import { isSavedBlock, isSavedLayout, isSavedPopup } from "visual/types/utils";
import {
  UploadSavedBlocksData,
  UploadSavedLayoutsData
} from "visual/utils/api/types";
import { BlockTypes } from "../types";
import { SavedBlock, SavedLayout } from "visual/types";

type Data = UploadSavedLayoutsData | UploadSavedBlocksData;

export const ShowSuccessError = (data: Data, type: BlockTypes): void => {
  const config = {
    toastContainer: window.parent.document.body,
    hideAfter: 5
  };

  data.success.forEach((block: SavedBlock | SavedLayout) => {
    switch (type) {
      case "BLOCK": {
        if (isSavedLayout(block)) {
          ToastNotification.error(
            "Your .zip contains layouts. We imported them in the Saved Layouts library",
            config
          );
        }
        if (isSavedPopup(block)) {
          ToastNotification.error(
            "Your .zip contains popups blocks. We imported them in the Saved Popups library",
            config
          );
        }
        break;
      }
      case "POPUP": {
        if (isSavedLayout(block)) {
          ToastNotification.error(
            "Your .zip contains layouts. We imported them in the Saved Layouts library",
            config
          );
        }
        if (isSavedBlock(block)) {
          ToastNotification.error(
            "Your .zip contains regular blocks. We imported them in the Saved Blocks library",
            config
          );
        }
        break;
      }
      case "LAYOUT": {
        if (isSavedBlock(block)) {
          ToastNotification.error(
            "Your .zip contains regular blocks. We imported them in the Saved Blocks library",
            config
          );
        }
        if (isSavedPopup(block)) {
          ToastNotification.error(
            "Your .zip contains popups blocks. We imported them in the Saved Popups library",
            config
          );
        }
        break;
      }
    }
  });
};
