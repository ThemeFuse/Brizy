import React, { ReactElement, useCallback } from "react";
import { useDispatch } from "react-redux";
import Fixed from "visual/component/Prompts/Fixed";
import {
  setLayout,
  setTitle
} from "visual/component/Prompts/PromptPageTemplate/types/Setters";
import {
  cancel,
  save,
  switchTab
} from "visual/component/Prompts/common/states/Classic/types/Actions";
import { useStateReducer } from "visual/component/Prompts/common/states/Classic/useStateReducer";
import { getChoices } from "visual/component/Prompts/utils";
import Config from "visual/global/Config";
import { isCloud, isShopify } from "visual/global/Config/types/configs/Cloud";
import { updatePageLayout, updatePageTitle } from "visual/redux/actions2";
import { shopifySyncPage } from "visual/utils/api";
import { isNonEmptyArray } from "visual/utils/array/types";
import { t } from "visual/utils/i18n";
import { Button } from "../common/Button";
import { Content } from "../common/Content";
import { Header } from "../common/Header";
import { Input } from "../common/PromptPage/Input";
import { SettingsTab } from "../common/PromptPage/SettingsTab";
import { Tabs, tabs } from "../common/PromptPage/types";
import { reducer } from "./reducer";
import { Props } from "./types";
import { Valid } from "./types";

export const PromptPageTemplate = (props: Props): ReactElement => {
  const { headTitle, pageTitle, selectedLayout, opened, onClose, onSave } =
    props;

  const { value } = selectedLayout || { value: undefined };

  const dispatch = useDispatch();

  const handleSave = useCallback(
    ({ title, layout }: Valid): Promise<void> => {
      dispatch(updatePageLayout(layout));
      dispatch(updatePageTitle(title));

      return onSave()
        .then(() => shopifySyncPage(title))
        .then(() => undefined);
    },
    [dispatch, onSave]
  );
  const getData = useCallback(async () => {
    const config = Config.getAll();
    if (isCloud(config) && isShopify(config)) {
      const layouts = getChoices(config);

      if (isNonEmptyArray(layouts)) {
        return {
          layouts,
          title: pageTitle,
          layout: value ?? layouts[0].id,
          error: undefined
        };
      }
    }

    return Promise.reject();
  }, [pageTitle, value]);

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
        onClick={(): void => dispatchS(save())}
      >
        {t("Save")}
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
          case Tabs.page:
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
                onChange={(v): void => dispatchS(setLayout(v))}
                error={state.payload.error}
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
