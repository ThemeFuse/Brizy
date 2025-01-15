import React, { ReactElement, useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { SavedBlock as Control } from "visual/component/Controls/SavedBlock";
import { ToastNotification } from "visual/component/Notifications";
import Prompts, { PromptsProps } from "visual/component/Prompts";
import { useConfig } from "visual/global/hooks";
import {
  extraFontStylesSelector,
  pageDataNoRefsSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { t } from "visual/utils/i18n";
import { getWhiteLabel } from "visual/utils/whiteLabel";
import { Component, Selector } from "./types";
import { getBlock, handleCreateSaveBlock, isError, isWarn } from "./utils";

const selector = (state: ReduxState): Selector => ({
  isAuthorized:
    state.authorized === "connected" || state.authorized === "pending",
  pageBlocks: pageDataNoRefsSelector(state),
  extraFontStyles: extraFontStylesSelector(state)
});

export const SavedBlockOption: Component = ({
  className,
  config
}): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    isAuthorized,
    pageBlocks: { items: pageItems },
    extraFontStyles
  } = useSelector(selector, shallowEqual);
  const globalConfig = useConfig();

  const {
    blockId,
    blockType = "normal",
    title,
    tooltipContent,
    icon
  } = config || {};
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClick = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (!blockId) {
      return ToastNotification.error(t("Could not Create Saved Block"));
    }

    const block = getBlock({ pageItems, blockId, blockType });

    if (!block) {
      const error =
        blockType === "normal"
          ? t("Could not Create Saved Block")
          : t("Could not Create Saved Popup");

      return ToastNotification.error(error);
    }

    const hasWhiteLabel = getWhiteLabel();

    const handleValidateBlockCreation = async () => {
      try {
        await handleCreateSaveBlock({
          blockType,
          block,
          extraFontStyles,
          blockId,
          config: globalConfig
        });
      } catch (err: unknown) {
        if (isError(err)) {
          const { message } = err;
          return ToastNotification.error(message);
        }

        if (isWarn(err)) {
          const { message, hideAfter } = err;
          return ToastNotification.warn(message, hideAfter);
        }

        return ToastNotification.error(t("Something went wrong"));
      }
    };
    setLoading(true);

    if (hasWhiteLabel || isAuthorized) {
      await handleValidateBlockCreation();
    } else {
      const data: PromptsProps = {
        mode: "stack",
        prompt: "authorization",
        props: {
          onClose: handleValidateBlockCreation,
          onSkip: handleValidateBlockCreation,
          onSuccess: handleValidateBlockCreation
        }
      };
      Prompts.open(data);
    }
    if (isMounted.current) {
      setLoading(false);
    }
  };

  return (
    <Control
      onClick={handleClick}
      className={className}
      title={title ?? t("Add")}
      icon={icon ?? "nc-save-section"}
      tooltipContent={tooltipContent}
      loading={loading}
    />
  );
};
