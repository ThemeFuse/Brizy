import React, { ReactElement, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "visual/component/Controls/Switch";
import { Field } from "visual/component/Prompts/common/PromptPage/Field";
import { HeaderFooterField } from "visual/component/Prompts/common/PromptPage/HeaderFooterField";
import {
  cancel,
  save,
  switchTab
} from "visual/component/Prompts/common/states/Classic/types/Actions";
import { useStateReducer } from "visual/component/Prompts/common/states/Classic/useStateReducer";
import Fixed from "visual/component/Prompts/Fixed";
import {
  setIsHomePage,
  setLayout,
  setTitle
} from "visual/component/Prompts/PromptPageTemplate/types/Setters";
import {
  canSyncPage,
  getChoices,
  getShopifyLayout,
  isShopifyLayout
} from "visual/component/Prompts/utils";
import Config from "visual/global/Config";
import {
  isCloud,
  isShopify,
  Shopify
} from "visual/global/Config/types/configs/Cloud";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  updateError,
  updatePageIsHomePage,
  updatePageLayout,
  updatePageTitle
} from "visual/redux/actions2";
import { shopifySyncPage } from "visual/utils/api";
import { isNonEmptyArray } from "visual/utils/array/types";
import { SYNC_ERROR } from "visual/utils/errors";
import { t } from "visual/utils/i18n";
import { Button } from "../common/Button";
import { Content } from "../common/Content";
import { Header } from "../common/Header";
import { Input } from "../common/PromptPage/Input";
import { Layout, Tabs, tabs } from "../common/PromptPage/types";
import { reducer } from "./reducer";
import { Props, Valid } from "./types";

export const PromptPageTemplate = (props: Props): ReactElement => {
  const _config = Config.getAll();

  const {
    pageId,
    headTitle,
    pageTitle,
    selectedLayout,
    opened,
    onClose,
    onSave,
    onAfterSave
  } = props;

  const isHomePage = pageId === selectedLayout?.isHomePage;

  const { value } = selectedLayout || { value: undefined };

  const dispatch = useDispatch();

  const handleSave = useCallback(
    ({ title, layout, isHomePage }: Valid): Promise<void> => {
      dispatch(updatePageLayout(layout));
      dispatch(updatePageTitle(title));
      dispatch(updatePageIsHomePage(isHomePage ? pageId : null));

      return onSave()
        .then(() => {
          return shopifySyncPage({
            config: _config as Shopify,
            title,
            isHomePage
          }).then(() => {
            if (typeof onAfterSave === "function") {
              onAfterSave();
            }
          });
        })
        .then(() => undefined);
    },
    [dispatch, onSave, onAfterSave, pageId, _config]
  );
  const getData = useCallback(async () => {
    const config = Config.getAll();
    if (isCloud(config) && isShopify(config)) {
      const layouts = getChoices(config);

      if (isNonEmptyArray(layouts)) {
        return {
          layouts,
          title: pageTitle,
          layout: value ?? getShopifyLayout(layouts)?.id ?? layouts[0].id,
          error: undefined,
          isHomePage
        };
      }
    }

    return Promise.reject();
  }, [pageTitle, value, isHomePage]);

  const [state, dispatchS] = useStateReducer(
    reducer,
    getData,
    handleSave,
    onClose
  );

  const footer = (
    <>
      <Button
        size={3}
        loading={state.type === "Canceling"}
        onClick={(): void => dispatchS(cancel())}
      >
        {t("Cancel")}
      </Button>
      <Button
        color="teal"
        size={3}
        loading={state.type === "Saving"}
        onClick={(): void => {
          const configCommon = _config as ConfigCommon;
          const canSync = canSyncPage(configCommon);

          if (canSync) {
            dispatchS(save());
          } else {
            dispatch(
              updateError({
                code: SYNC_ERROR,
                data: {
                  upgradeToProUrl: configCommon?.modules?.shop?.upgradeToProUrl
                }
              })
            );
          }
        }}
      >
        {t("Publish")}
      </Button>
    </>
  );

  const content: () => ReactElement = () => {
    switch (state.type) {
      case "Loading":
        return <Content head={headTitle} loading={true} />;
      case "Err":
        return <Content head={headTitle} error={state.payload.message} />;
      case "Ready":
      case "Saving":
      case "Canceling":
      case "Canceled": {
        switch (state.payload.activeTab) {
          case Tabs.settings: {
            const hasShopifyLayout = !!getShopifyLayout(state.payload.layouts);
            const isShopifyLayoutEnabled = isShopifyLayout(
              state.payload.layout
            );

            return (
              <Content
                head={headTitle}
                inlineFooter={true}
                footer={footer}
                error={state.payload.error}
              >
                <Input
                  value={state.payload.title ?? ""}
                  onChange={(v): void => dispatchS(setTitle(v))}
                  placeholder={t("Page title")}
                />
                {hasShopifyLayout && (
                  <HeaderFooterField
                    value={isShopifyLayoutEnabled}
                    onChange={(v): void => {
                      const data = v ? Layout.Shopify : Layout.Default;
                      dispatchS(setLayout(data));
                    }}
                  />
                )}
                <Field
                  className="brz-ed-popup-integrations-step__fields-option-home-page"
                  label={t("Set as Homepage")}
                  required={false}
                >
                  <Switch
                    value={state.payload.isHomePage}
                    onChange={(v): void => dispatchS(setIsHomePage(v))}
                  />
                </Field>
              </Content>
            );
          }
        }
      }
    }
  };

  return (
    <Fixed opened={opened} onClose={onClose}>
      <div className="brz-ed-popup-wrapper">
        <Header
          tabs={tabs.map((tab) => ({
            ...tab,
            active: tab.id === state.payload.activeTab,
            onClick: (): void => dispatchS(switchTab(tab.id))
          }))}
          onClose={onClose}
        />
        {content()}
      </div>
    </Fixed>
  );
};
