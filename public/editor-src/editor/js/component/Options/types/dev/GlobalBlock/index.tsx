import React, { ReactElement, useCallback, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Switch as Control } from "visual/component/Controls/Switch";
import { ToastNotification } from "visual/component/Notifications";
import Config from "visual/global/Config";
import {
  makeGlobalBlockToPopup,
  makeGlobalToNormalBlock,
  makeNormalToGlobalBlock,
  makePopupToGlobalBlock
} from "visual/redux/actions2";
import {
  blocksDataSelector,
  extraFontStylesSelector,
  globalBlocksAssembled2Selector,
  pageBlocksDataSelector,
  pageSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { Block, GlobalBlock, Screenshot } from "visual/types";
import { isGlobalPopup } from "visual/types/utils";
import {
  createGlobalBlock,
  createGlobalPopup,
  pendingRequest
} from "visual/utils/api";
import { changeRule, isPopup } from "visual/utils/blocks";
import { t } from "visual/utils/i18n";
import { getBlockData, setIds } from "visual/utils/models";
import { uuid } from "visual/utils/uuid";
import { PortalLoading } from "./PortalLoading";
import { getOpenedPopupId, openPopupById } from "./popupHandlers";
import { Component, Selector } from "./types";
import { createScreenshot, getBlockType, openPromptCondition } from "./utils";

const selector = (state: ReduxState): Selector => ({
  extraFontStyles: extraFontStylesSelector(state),
  pageBlocks: pageBlocksDataSelector(state),
  globalBlocks: globalBlocksAssembled2Selector(state),
  blocksData: blocksDataSelector(state),
  page: pageSelector(state)
});

export const GlobalBlockOption: Component = ({
  className,
  label,
  config
}): ReactElement => {
  const { extraFontStyles, pageBlocks, globalBlocks, page } = useSelector(
    selector,
    shallowEqual
  );
  const dispatch = useDispatch();
  const switchKey = useRef(uuid(4));

  const { _id, parentId, blockType = "normal" } = config || {};

  const isGlobalBlock = useCallback((): boolean => {
    if (!_id) {
      return false;
    }
    const globalBlocksIds = Object.keys(globalBlocks);

    return globalBlocksIds.includes(_id);
  }, [_id, globalBlocks]);

  const handleChange = async (checked: boolean): Promise<void> => {
    // if '_id' starts from number - document.getElementById(_id) will throw an error.
    // Because while they are valid in the HTML5 spec,
    // they are not valid in CSS, which is what "query selector" means.
    // document.querySelector(`id=['${_id}']`) - was added for that case

    if (!_id) {
      return ToastNotification.error(t("Something went wrong"));
    }

    const node: HTMLElement | null = document.querySelector(`[id='${_id}']`);
    const loading = PortalLoading.render(node);
    const blockData: Block = setIds(getBlockData(pageBlocks, _id));

    if (checked) {
      if (!blockData) {
        switchKey.current = uuid(4);
        ToastNotification.error(t("Could not Create Global Block"));
        PortalLoading.close(loading);
        return;
      }

      if (node) {
        const screenshot: Screenshot | undefined = await createScreenshot(node);
        const meta: GlobalBlock["meta"] = {
          extraFontStyles,
          type: getBlockType(blockType)
        };

        if (screenshot) {
          meta._thumbnailSrc = screenshot._thumbnailSrc;
          meta._thumbnailWidth = screenshot._thumbnailWidth;
          meta._thumbnailHeight = screenshot._thumbnailHeight;
          meta._thumbnailTime = screenshot._thumbnailTime;
        }

        if (Object.prototype.hasOwnProperty.call(blockData, "deleted")) {
          blockData.deleted = false;
        }

        let globalBlock = {
          uid: blockData.value._id,
          meta,
          status: "draft",
          data: blockData,
          rules: [],
          dependencies: [],
          dataVersion: 0,
          position: { align: "bottom", top: 0, bottom: 0 }
        } as GlobalBlock;
        const newBlockId = blockData.value._id;
        const config = Config.getAll();

        if (!isPopup(blockData) && page) {
          globalBlock = changeRule(globalBlock, true, page);
        }

        if (isGlobalPopup(globalBlock)) {
          try {
            const popup = await createGlobalPopup(globalBlock, config);

            if (popup.data) {
              dispatch(
                makePopupToGlobalBlock({
                  block: globalBlock,
                  fromBlockId: _id,
                  type: blockType === "popup" ? "popup" : "externalPopup"
                })
              );

              const popupId = blockType === "popup" && getOpenedPopupId();
              if (popupId) {
                requestAnimationFrame(() => openPopupById(popupId));
              }

              if (blockType === "externalPopup") {
                openPromptCondition({ type: "popup", _id: newBlockId });
              }
            } else {
              switchKey.current = uuid(4);
              ToastNotification.error(t("Could not Create Global Popup"));
            }
          } catch (e) {
            console.error(e);
            switchKey.current = uuid(4);
            ToastNotification.error(t("Could not Create Global Popup"));
          }
        } else {
          try {
            const block = await createGlobalBlock(globalBlock, config);

            if (block.data) {
              dispatch(
                makeNormalToGlobalBlock({
                  block: globalBlock,
                  fromBlockId: _id
                })
              );
              openPromptCondition({ type: "block", _id: newBlockId });
            } else {
              switchKey.current = uuid(4);
              ToastNotification.error(t("Could not Create Global Block"));
            }
          } catch (e) {
            console.error(e);
            switchKey.current = uuid(4);
            ToastNotification.error(t("Could not Create Global Block"));
          }
        }

        PortalLoading.close(loading);
      }
    } else {
      await pendingRequest();

      if (globalBlocks[_id]?.data) {
        PortalLoading.close(loading);

        const data = {
          block: setIds(globalBlocks[_id].data),
          fromBlockId: _id
        };

        switch (blockType) {
          case "popup": {
            const popupId = getOpenedPopupId();

            parentId && dispatch(makeGlobalBlockToPopup({ ...data, parentId }));
            if (popupId) {
              requestAnimationFrame(() => openPopupById(popupId));
            }
            break;
          }
          case "normal":
          case "externalPopup": {
            dispatch(makeGlobalToNormalBlock(data));
            break;
          }
        }
      }
    }
  };

  return (
    <>
      {label}
      <Control
        key={switchKey.current}
        className={className}
        value={isGlobalBlock()}
        onChange={handleChange}
      />
    </>
  );
};
