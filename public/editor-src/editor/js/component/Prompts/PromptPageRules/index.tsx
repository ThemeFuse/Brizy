import { omit, without } from "es-toolkit";
import { find } from "es-toolkit/compat";
import React, { JSX, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { CheckGroup } from "visual/component/Controls/CheckGroup";
import { CheckGroupIcon } from "visual/component/Controls/CheckGroup/CheckGroupIcon";
import { CheckGroupItem } from "visual/component/Controls/CheckGroup/CheckGroupItem";
import Fixed from "visual/component/Prompts/Fixed";
import { EmptyContentWithDefaults } from "visual/component/Prompts/common/PromptPage/EmptyContent";
import { HeaderFooterField } from "visual/component/Prompts/common/PromptPage/HeaderFooterField";
import { useStateReducer } from "visual/component/Prompts/common/states/Classic/useStateReducer";
import {
  canSyncPage,
  getAllOptionText,
  getChoices,
  getRulesId,
  getShopifyLayout,
  getTabsByItemsNumber,
  isAllChecked,
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
import { useConfig } from "visual/global/hooks";
import {
  updateError,
  updatePageLayout,
  updatePageTitle
} from "visual/redux/actions2";
import { Layout } from "visual/types/Layout";
import {
  getCollectionSourceItemsById,
  getPageRelations,
  shopifySyncRules
} from "visual/utils/api";
import { SelectedItem } from "visual/utils/api/types";
import { isNonEmptyArray } from "visual/utils/array/types";
import { SYNC_ERROR } from "visual/utils/errors";
import { t } from "visual/utils/i18n";
import * as Obj from "visual/utils/reader/object";
import { Button } from "../common/Button";
import { Content } from "../common/Content";
import { Header } from "../common/Header";
import { Input } from "../common/PromptPage/Input";
import { Tabs } from "../common/PromptPage/types";
import * as Actions from "../common/states/Classic/types/Actions";
import { reducer } from "./reducer";
import { Item, Props, RulesState, Valid } from "./types";
import * as Setters from "./types/Setters";

const getErrors = (s: RulesState): string | undefined => {
  switch (s.type) {
    case "Loading":
    case "Err":
    case "Saving":
      return undefined;
    case "Ready":
    case "Canceling":
    case "Canceled":
      return s.payload.error;
  }
};

export const PromptPageRules = (props: Props): JSX.Element => {
  const _config = useConfig();
  const _isShopify = isCloud(_config) && isShopify(_config);

  const templateType = useMemo(() => {
    return getShopifyTemplate(_config) ?? ShopifyTemplate.Product;
  }, [_config]);

  const {
    headTitle,
    pageTitle,
    opened,
    selectedLayout,
    onClose,
    onSave,
    onAfterSave
  } = props;

  const { value } = selectedLayout || { value: undefined };

  const page = (_config as Shopify).page;
  const modules = (_config as Shopify).modules;
  const _templateType = (_config as Shopify).templateType;
  const templates = (_config as Shopify).templates;

  const dispatch = useDispatch();
  const handleSave = useCallback(
    ({ items, title, layout }: Valid): Promise<void> => {
      const optionAll = find(items, { id: "all" });

      const _items = optionAll ? without(items, optionAll) : items;

      dispatch(updatePageLayout(layout));
      dispatch(updatePageTitle(title));

      return onSave()
        .then(() => {
          return shopifySyncRules({
            page,
            modules,
            rules: _items.filter((i): i is SelectedItem => i.selected),
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
    [dispatch, onSave, onAfterSave, page, modules]
  );
  const getData = useCallback(async () => {
    if (_isShopify) {
      const selectedP = getPageRelations(modules).then((is) =>
        is.map((i) => i.id)
      );
      const itemsP = getCollectionSourceItemsById(_templateType, _config.api);

      const _items = await Promise.all([itemsP, selectedP]).then(
        ([items, selected]): Item[] =>
          items.map((i) => ({ ...i, selected: selected.includes(i.id) }))
      );

      const items = [
        {
          id: "all",
          type: "",
          title: getAllOptionText(templateType),
          selected: isAllChecked(_items)
        },
        ..._items
      ];

      const layouts = getChoices(templates);

      if (isNonEmptyArray(layouts)) {
        return {
          items,
          layouts,
          title: pageTitle,
          layout: value ?? layouts[0].id,
          error: undefined
        };
      }
    }

    return Promise.reject();
  }, [
    _isShopify,
    pageTitle,
    value,
    templateType,
    templates,
    _config.api,
    _templateType,
    modules
  ]);

  const [state, dispatchS] = useStateReducer(
    reducer,
    getData,
    handleSave,
    onClose
  );

  const footer = useMemo(
    () => (
      <>
        <Button
          size={3}
          loading={state.type === "Canceling"}
          onClick={(): void => dispatchS(Actions.cancel())}
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
              dispatchS(Actions.save());
            } else {
              dispatch(
                updateError({
                  code: SYNC_ERROR,
                  data: {
                    upgradeToProUrl:
                      configCommon?.modules?.shop?.upgradeToProUrl
                  }
                })
              );
            }
          }}
        >
          {t("Publish")}
        </Button>
      </>
    ),
    [_config, dispatch, dispatchS, state.type]
  );

  const content: () => JSX.Element = () => {
    switch (state.type) {
      case "Loading":
        return <Content head={headTitle} loading={true} />;
      case "Err":
        return <Content head={headTitle} error={state.payload.message} />;
      case "Ready":
      case "Saving":
      case "Canceling":
      case "Canceled": {
        const { items, title } = state.payload;
        const checked = items
          .filter((i) => i.selected)
          .reduce((acc: Record<string, boolean>, i) => {
            acc[i.id] = true;
            return acc;
          }, {});

        const error = getErrors(state);

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
                error={error}
                inlineFooter={true}
                footer={footer}
              >
                <Input
                  value={title ?? ""}
                  onChange={(v): void => dispatchS(Setters.setTitle(v))}
                  placeholder={t("Page title")}
                />
                {hasShopifyLayout && (
                  <HeaderFooterField
                    value={isShopifyLayoutEnabled}
                    onChange={(v): void => {
                      const data = v ? Layout.Shopify : Layout.Default;
                      dispatchS(Setters.setLayout(data));
                    }}
                  />
                )}
                <CheckGroup
                  defaultValue={checked}
                  onChange={(v: Record<string, boolean>): void => {
                    if (Obj.hasKey("all", v)) {
                      if (v.all) {
                        const someItemWasUnchecked = !Object.values(v).every(
                          (i) => i
                        );

                        if (someItemWasUnchecked) {
                          dispatchS(
                            Setters.setRules(getRulesId(omit(v, ["all"])))
                          );
                        } else {
                          const rules = items.map((i) => i.id);
                          dispatchS(Setters.setRules([...rules, "all"]));
                        }
                      } else {
                        dispatchS(Setters.setRules([]));
                      }
                    } else {
                      dispatchS(Setters.setRules(getRulesId(v)));
                    }
                  }}
                >
                  {items.map((rule) => (
                    <CheckGroupItem
                      key={rule.id}
                      divider={true}
                      inline={true}
                      value={rule.id}
                      renderIcons={CheckGroupIcon}
                      isEditor
                    >
                      {rule.title}
                    </CheckGroupItem>
                  ))}
                </CheckGroup>
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
            onClick: (v): void => dispatchS(Actions.switchTab(v))
          }))}
          onClose={onClose}
        />
        {content()}
      </div>
    </Fixed>
  );
};
