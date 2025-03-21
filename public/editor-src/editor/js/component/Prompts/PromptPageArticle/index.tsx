import React, { ReactElement, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import Radio, { RadioItem } from "visual/component/Controls/Radio";
import Fixed from "visual/component/Prompts/Fixed";
import { reducer } from "visual/component/Prompts/PromptPageArticle/reducer";
import {
  setBlog,
  setLayout,
  setTitle
} from "visual/component/Prompts/PromptPageArticle/types/Setters";
import { EmptyContentWithDefaults } from "visual/component/Prompts/common/PromptPage/EmptyContent";
import { HeaderFooterField } from "visual/component/Prompts/common/PromptPage/HeaderFooterField";
import {
  cancel,
  save,
  switchTab
} from "visual/component/Prompts/common/states/Classic/types/Actions";
import { useStateReducer } from "visual/component/Prompts/common/states/Classic/useStateReducer";
import {
  canSyncPage,
  getChoices,
  getShopifyLayout,
  getTabsByItemsNumber,
  isShopifyLayout
} from "visual/component/Prompts/utils";
import {
  Shopify,
  isCloud,
  isShopify
} from "visual/global/Config/types/configs/Cloud";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  ShopifyTemplate,
  getShopifyTemplate
} from "visual/global/Config/types/shopify/ShopifyTemplate";
import {
  updateError,
  updatePageLayout,
  updatePageTitle
} from "visual/redux/actions2";
import { Layout } from "visual/types/Layout";
import {
  getPageRelations,
  shopifyBlogItems,
  shopifySyncArticle
} from "visual/utils/api";
import { isNonEmptyArray } from "visual/utils/array/types";
import { ErrorCodes } from "visual/utils/errors";
import { t } from "visual/utils/i18n";
import { Button } from "../common/Button";
import { Content } from "../common/Content";
import { Header } from "../common/Header";
import { Input } from "../common/PromptPage/Input";
import { Tabs } from "../common/PromptPage/types";
import { Props, Valid } from "./types";

export const PromptPageArticle = (props: Props): ReactElement => {
  const templateType = useMemo(() => {
    return getShopifyTemplate(props.config) ?? ShopifyTemplate.Product;
  }, [props.config]);

  const {
    headTitle,
    pageTitle,
    opened,
    selectedLayout,
    onClose,
    onSave,
    onAfterSave,
    config
  } = props;

  const { value } = selectedLayout || { value: undefined };

  const dispatch = useDispatch();

  const handleSave = useCallback(
    ({ selected, title, layout }: Valid): Promise<void> => {
      dispatch(updatePageLayout({ layout, config }));
      dispatch(updatePageTitle({ title, config }));

      return onSave()
        .then(() => {
          return shopifySyncArticle({
            config: config as Shopify,
            blogId: selected.id,
            blogTitle: selected.title,
            title,
            layout
          }).then(() => {
            if (typeof onAfterSave === "function") {
              onAfterSave();
            }
          });
        })
        .then(() => undefined);
    },
    [dispatch, onSave, onAfterSave, config]
  );
  const getData = useCallback(async () => {
    if (isCloud(config) && isShopify(config)) {
      const selectedP = getPageRelations(config.modules).then((is) =>
        is.map((i) => i.blog_id || i.id)
      );
      const itemsP = shopifyBlogItems(config);

      const [items, selected] = await Promise.all([itemsP, selectedP]);
      const layouts = getChoices(config.templates);

      if (isNonEmptyArray(layouts)) {
        return {
          items,
          layouts,
          selected: items.find((i) => i.id === selected[0]),
          title: pageTitle,
          layout: value ?? layouts[0].id,
          error: undefined
        };
      }
    }

    return Promise.reject();
  }, [pageTitle, value, config]);

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
          const configCommon = config as ConfigCommon;
          const canSync = canSyncPage(configCommon);

          if (canSync) {
            dispatchS(save());
          } else {
            dispatch(
              updateError({
                code: ErrorCodes.SYNC_ERROR,
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
        const { items } = state.payload;

        switch (state.payload.activeTab) {
          case Tabs.settings: {
            if (!items.length) {
              return <EmptyContentWithDefaults type={templateType} />;
            }

            const hasShopifyLayout = !!getShopifyLayout(state.payload.layouts);
            const isShopifyLayoutEnabled = isShopifyLayout(
              state.payload.layout
            );

            return (
              <Content
                head={headTitle}
                error={state.payload.error}
                inlineFooter={true}
                footer={footer}
              >
                <Input
                  value={state.payload.title ?? ""}
                  onChange={(s): void => dispatchS(setTitle(s))}
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
                <Radio
                  className="brz-ed-popup-integrations-option__radio"
                  defaultValue={state.payload.selected?.id}
                  onChange={(v: string): void => dispatchS(setBlog(v))}
                >
                  {items.map(({ title, id }) => {
                    return (
                      <RadioItem checkIcon="active" value={id} key={id}>
                        {title}
                      </RadioItem>
                    );
                  })}
                </Radio>
              </Content>
            );
          }
        }
      }
    }
  };

  const tabs = getTabsByItemsNumber(state);

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
