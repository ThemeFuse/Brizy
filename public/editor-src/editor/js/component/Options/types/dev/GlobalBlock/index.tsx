import React, { ReactElement, useCallback, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getOptions } from "visual/component/ConditionsComponent";
import { Switch as Control } from "visual/component/Controls/Switch";
import { ToastNotification } from "visual/component/Notifications";
import Prompts from "visual/component/Prompts";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { useConfig } from "visual/providers/ConfigProvider";
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
import { Block } from "visual/types/Block";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Screenshot } from "visual/types/Screenshot";
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
import { Component, OpenPromptCondition, Selector } from "./types";
import { createScreenshot, getBlockType } from "./utils";

const selector =
  (config: ConfigCommon) =>
  (state: ReduxState): Selector => ({
    extraFontStyles: extraFontStylesSelector(state),
    pageBlocks: pageBlocksDataSelector(state, config),
    globalBlocks: globalBlocksAssembled2Selector(state),
    blocksData: blocksDataSelector(state),
    page: pageSelector(state)
  });

export const GlobalBlockOption: Component = ({
  className,
  label,
  config
}): ReactElement => {
  const globalConfig = useConfig();

  const { extraFontStyles, pageBlocks, globalBlocks, page } = useSelector(
    selector(globalConfig),
    shallowEqual
  );
  const dispatch = useDispatch();
  const switchKey = useRef(uuid(4));
  const [loading, setLoading] = useState(false);
  const portalRef = useRef<HTMLElement | null>(null);

  const { _id, parentId, blockType = "normal" } = config || {};

  const isGlobalBlock = useCallback((): boolean => {
    if (!_id) {
      return false;
    }
    const globalBlocksIds = Object.keys(globalBlocks);

    return globalBlocksIds.includes(_id);
  }, [_id, globalBlocks]);

  const openPromptCondition = useCallback(
    ({ type, blockId, rules }: OpenPromptCondition): void => {
      if (!blockId) {
        return ToastNotification.error(t("Something went wrong"));
      }

      const data = { value: blockId, type, rules, dispatch };
      Prompts.open({
        prompt: "conditions",
        mode: "single",
        props: {
          options: getOptions(data, globalConfig)
        }
      });
    },
    [dispatch, globalConfig]
  );

  const handleChange = async (checked: boolean): Promise<void> => {
    // if '_id' starts from number - document.getElementById(_id) will throw an error.
    // Because while they are valid in the HTML5 spec,
    // they are not valid in CSS, which is what "query selector" means.
    // document.querySelector(`id=['${_id}']`) - was added for that case

    if (!_id) {
      return ToastNotification.error(t("Something went wrong"));
    }

    const node: HTMLElement | null = document.querySelector(`[id='${_id}']`);
    const blockData: Block = setIds(getBlockData(pageBlocks, _id));
    setLoading(true);
    portalRef.current = node;

    if (checked) {
      if (!blockData) {
        setLoading(false);
        switchKey.current = uuid(4);
        ToastNotification.error(t("Could not Create Global Block"));
        return;
      }

      if (node) {
        const screenshot: Screenshot | undefined = await createScreenshot(
          node,
          globalConfig
        );
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
          data: {
            ...blockData,
            editorVersion: globalConfig.editorVersion
          },
          rules: [],
          dependencies: [],
          dataVersion: 0,
          position: { align: "bottom", top: 0, bottom: 0 }
        } as GlobalBlock;
        const newBlockId = blockData.value._id;

        if (!isPopup(blockData) && page) {
          globalBlock = changeRule(globalBlock, true, page, globalConfig);
        }

        if (isGlobalPopup(globalBlock)) {
          try {
            const popup = await createGlobalPopup(globalBlock, globalConfig);

            if (popup.data) {
              const data = { block: globalBlock, fromBlockId: _id };
              dispatch(
                makePopupToGlobalBlock(
                  blockType === "normal"
                    ? { ...data, type: "normal" }
                    : { ...data, type: "external" }
                )
              );

              const popupId = blockType === "popup" && getOpenedPopupId();
              if (popupId) {
                // Using setTimeout to reopen the popup because when switching between global and normal blocks,
                // the section is unmounted
                setTimeout(() => openPopupById(popupId), 200);
              }

              if (blockType === "externalPopup") {
                openPromptCondition({
                  type: "popup",
                  blockId: newBlockId,
                  rules: globalBlock.rules
                });
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
            const block = await createGlobalBlock(globalBlock, globalConfig);

            if (block.data) {
              dispatch(
                makeNormalToGlobalBlock({
                  block: globalBlock,
                  fromBlockId: _id
                })
              );
              openPromptCondition({
                type: "block",
                blockId: newBlockId,
                rules: globalBlock.rules
              });
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

        setLoading(false);
      }
    } else {
      await pendingRequest();

      if (globalBlocks[_id]?.data) {
        setLoading(false);

        const data = {
          block: setIds(globalBlocks[_id].data),
          fromBlockId: _id
        };

        switch (blockType) {
          case "popup": {
            const popupId = getOpenedPopupId();

            parentId &&
              dispatch(
                makeGlobalBlockToPopup({ ...data, type: "normal", parentId })
              );
            if (popupId) {
              // Using setTimeout to reopen the popup because when switching between global and normal blocks,
              // the section is unmounted
              setTimeout(() => openPopupById(popupId), 200);
            }
            break;
          }
          case "externalPopup": {
            dispatch(makeGlobalBlockToPopup({ ...data, type: "external" }));
            break;
          }
          case "normal": {
            dispatch(
              makeGlobalToNormalBlock({ ...data, config: globalConfig })
            );
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
      {loading && <PortalLoading node={portalRef.current} />}
    </>
  );
};
