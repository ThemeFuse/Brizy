import React, { ReactElement, useCallback, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Switch as Control } from "visual/component/Controls/Switch";
import { ToastNotification } from "visual/component/Notifications";
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
  pageBlocksNoRefsSelector,
  pageSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { Block, GlobalBlock, Screenshot } from "visual/types";
import { createGlobalBlock, pendingRequest } from "visual/utils/api";
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
  pageBlocks: pageBlocksNoRefsSelector(state),
  globalBlocks: globalBlocksAssembled2Selector(state),
  blocksData: blocksDataSelector(state),
  page: pageSelector(state)
});

export const GlobalBlockOption: Component = ({
  className,
  label,
  config
}): ReactElement => {
  const { extraFontStyles, pageBlocks, globalBlocks, blocksData, page } =
    useSelector(selector, shallowEqual);
  const dispatch = useDispatch();
  const switchKey = useRef(uuid(4));

  const { _id, parentId, blockType = "normal" } = config || {};

  const isGlobalBlock = useCallback((): boolean => {
    if (!_id) {
      return false;
    }
    const globalBlocksIds = Object.keys(globalBlocks);

    return globalBlocksIds.includes(_id);
  }, [_id]);

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
    const blockData = getBlockData(pageBlocks, _id);

    if (checked) {
      if (node && blockData) {
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

        let globalBlock: GlobalBlock = {
          meta,
          status: "draft",
          data: blockData,
          rules: [],
          position: { align: "bottom", top: 0, bottom: 0 }
        };

        if (!isPopup(blockData) && page) {
          globalBlock = changeRule(globalBlock, true, page);
        }

        await createGlobalBlock(globalBlock)
          .then((r): void => {
            if (!(r && r.data)) {
              throw r;
            }

            PortalLoading.close(loading);

            switch (blockType) {
              case "popup":
              case "externalPopup": {
                const popupId = blockType === "popup" && getOpenedPopupId();

                dispatch(makePopupToGlobalBlock(globalBlock));
                popupId && openPopupById(popupId);

                if (blockType === "externalPopup") {
                  openPromptCondition({ type: "popup", _id });
                }
                break;
              }
              case "normal": {
                dispatch(makeNormalToGlobalBlock(globalBlock));
                openPromptCondition({ type: "block", _id });
                break;
              }
            }
          })
          .catch((err: unknown): void => {
            PortalLoading.close(loading);

            switchKey.current = uuid(4);

            switch (blockType) {
              case "popup":
              case "externalPopup": {
                ToastNotification.error(t("Could not Create Global Popup"));
                break;
              }
              case "normal": {
                ToastNotification.error(t("Could not Create Global Block"));
                break;
              }
            }

            if (process.env.NODE_ENV === "development") {
              console.error(err);
            }
          });
      }
    } else {
      await pendingRequest();

      if (isGlobalBlock()) {
        const block: Block = setIds(blocksData[_id]);

        PortalLoading.close(loading);

        const data = {
          block,
          fromBlockId: _id
        };

        switch (blockType) {
          case "popup": {
            const popupId = getOpenedPopupId();

            parentId && dispatch(makeGlobalBlockToPopup({ ...data, parentId }));
            popupId && openPopupById(popupId);
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
