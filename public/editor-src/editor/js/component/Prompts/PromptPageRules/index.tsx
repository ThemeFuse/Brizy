import React, { ReactElement, useCallback, useMemo } from "react";
import Fixed from "visual/component/Prompts/Fixed";
import {
  getCollectionSourceItemsById,
  getPageRelations,
  shopifySyncRules
} from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { Button } from "../common/Button";
import { Content } from "../common/Content";
import { Header } from "../common/Header";
import CheckGroup, {
  CheckGroupIcon,
  CheckGroupItem
} from "visual/component/Controls/CheckGroup";
import { Props, RulesState, Valid } from "./types";
import { Tabs, tabs } from "../common/PromptPage/types";
import { SettingsTab } from "../common/PromptPage/SettingsTab";
import { Input } from "../common/PromptPage/Input";
import { updatePageLayout, updatePageTitle } from "visual/redux/actions2";
import { useDispatch } from "react-redux";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import * as Setters from "./types/Setters";
import * as Actions from "../common/states/Classic/types/Actions";
import { isNonEmptyArray } from "visual/utils/array/types";
import { useStateReducer } from "visual/component/Prompts/common/states/Classic/useStateReducer";
import { Item } from "./types";
import { reducer } from "./reducer";
import { SelectedItem } from "visual/utils/api/types";
import { getChoices } from "visual/component/Prompts/utils";

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

export const PromptPageRules = (props: Props): ReactElement => {
  const {
    headTitle,
    pageTitle,
    opened,
    selectedLayout,
    onClose,
    onSave
  } = props;
  const dispatch = useDispatch();
  const handleSave = useCallback(
    ({ items, title, layout }: Valid): Promise<void> => {
      dispatch(updatePageLayout(layout));
      dispatch(updatePageTitle(title));

      return onSave()
        .then(() =>
          shopifySyncRules(
            items.filter((i): i is SelectedItem => i.selected),
            title
          )
        )
        .then(() => undefined);
    },
    [dispatch]
  );
  const getData = useCallback(async () => {
    const config = Config.getAll();
    if (isCloud(config) && isShopify(config)) {
      const selectedP = getPageRelations(config).then(is => is.map(i => i.id));
      const itemsP = getCollectionSourceItemsById(config.templateType.id);

      const items = await Promise.all([
        itemsP,
        selectedP
      ]).then(([items, selected]): Item[] =>
        items.map(i => ({ ...i, selected: selected.includes(i.id) }))
      );
      const layouts = getChoices(config);

      if (isNonEmptyArray(items) && isNonEmptyArray(layouts)) {
        return {
          items,
          layouts,
          title: pageTitle,
          layout: selectedLayout?.value ?? layouts[0].id,
          error: undefined
        };
      }
    }

    return Promise.reject();
  }, []);

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
          onClick={(): void => dispatchS(Actions.save())}
        >
          {t("Save")}
        </Button>
      </>
    ),
    [dispatchS, state.type]
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
        const { items, title } = state.payload;
        const checked = items
          .filter(i => i.selected)
          .reduce((acc: Record<string, boolean>, i) => {
            acc[i.id] = true;
            return acc;
          }, {});

        const error = getErrors(state);

        switch (state.payload.activeTab) {
          case Tabs.page:
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
                <CheckGroup
                  defaultValue={checked}
                  onChange={(v: Record<string, boolean>): void =>
                    dispatchS(
                      Setters.setRules(
                        Object.entries(v)
                          .filter(([, v]) => v)
                          .map(([k]) => k)
                      )
                    )
                  }
                >
                  {items.map(rule => (
                    <CheckGroupItem
                      key={rule.id}
                      divider={true}
                      inline={true}
                      value={rule.id}
                      renderIcons={CheckGroupIcon}
                    >
                      {rule.title}
                    </CheckGroupItem>
                  ))}
                </CheckGroup>
              </Content>
            );
          case Tabs.settings:
            return (
              <SettingsTab
                layouts={state.payload.layouts}
                headTitle={headTitle}
                value={state.payload.layout}
                inlineFooter={true}
                footer={footer}
                onChange={(s): void => dispatchS(Setters.setLayout(s))}
                error={error}
              />
            );
        }
      }
    }
  };

  return (
    <Fixed opened={opened} onClose={onClose}>
      <div className="brz-ed-popup-wrapper">
        <Header
          tabs={tabs.map(tab => ({
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
