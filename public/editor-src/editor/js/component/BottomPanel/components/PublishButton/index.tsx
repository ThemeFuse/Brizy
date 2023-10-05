import { match } from "fp-utilities";
import React, { Component, ReactElement } from "react";
import { ConnectedProps, connect } from "react-redux";
import HotKeys from "visual/component/HotKeys";
import { ToastNotification } from "visual/component/Notifications";
import Prompts, { PromptsProps } from "visual/component/Prompts";
import Config from "visual/global/Config";
import {
  isCMS,
  isCloud,
  isShopify,
  isShopifyPage
} from "visual/global/Config/types/configs/Cloud";
import { isWp } from "visual/global/Config/types/configs/WP";
import { removeBlocks } from "visual/redux/actions2";
import { fetchPageSuccess, updatePageStatus } from "visual/redux/actions2";
import {
  extraFontStylesSelector,
  pageDataNoRefsSelector,
  pageSelector,
  storeWasChangedSelector
} from "visual/redux/selectors";
import { ReduxState, StoreChanged } from "visual/redux/types";
import { SavedLayout } from "visual/types";
import {
  createBlockScreenshot,
  createSavedLayout,
  shopifyUnpublishPage
} from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { isNumber } from "visual/utils/math";
import { isPopup, isStory } from "visual/utils/models";
import { browserSupports, makeNodeScreenshot } from "visual/utils/screenshots";
import { uuid } from "visual/utils/uuid";
import { BottomPanelItem } from "../Item";
import { Controls, Props as ControlsProps } from "./Control";
import {
  getButtonLabel,
  getMode,
  getTooltipPageIcon,
  getTooltipPageTitle
} from "./utils";

type Page = ReduxState["page"];

const _getMode = match(
  [isCloud, match([isShopify, getMode], [isCMS, (): undefined => undefined])],
  [isWp, (): undefined => undefined]
);

const mapState = (
  state: ReduxState
): {
  page: Page;
  pageData: Page["data"];
  extraFontStyles: ReduxState["extraFontStyles"];
  mode: "withRules" | "withTemplate" | "withArticle" | undefined;
  storeWasChanged: StoreChanged;
} => {
  const config = Config.getAll();
  return {
    page: pageSelector(state),
    pageData: pageDataNoRefsSelector(state),
    extraFontStyles: extraFontStylesSelector(state),

    storeWasChanged: storeWasChangedSelector(state),
    mode: _getMode(config)
  };
};
const mapDispatch = { updatePageStatus, removeBlocks, fetchPageSuccess };
const PublishConnector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof PublishConnector>;

type State = {
  updateLoading: boolean;
  layoutLoading: boolean;
  draftLoading: boolean;
  [key: string]: boolean;
};

class PublishButton extends Component<Props, State> {
  state = {
    updateLoading: false,
    layoutLoading: false,
    draftLoading: false
  };

  draftLoading: Promise<void> | undefined;
  updateLoading: Promise<void> | undefined;

  publish = (loading: "updateLoading" | "draftLoading"): void => {
    const { mode, storeWasChanged } = this.props;

    switch (mode) {
      case "withTemplate": {
        switch (storeWasChanged) {
          case StoreChanged.changed: {
            this.handlePublish(loading);
            break;
          }
          case StoreChanged.unchanged: {
            this.handlePublishWithLayout(loading);
            break;
          }
        }
        break;
      }
      case "withRules": {
        switch (storeWasChanged) {
          case StoreChanged.changed: {
            this.handlePublish(loading);
            break;
          }
          case StoreChanged.unchanged: {
            this.handlePublishWithRules(loading);
            break;
          }
        }
        break;
      }
      case "withArticle": {
        switch (storeWasChanged) {
          case StoreChanged.changed: {
            this.handlePublish(loading);
            break;
          }
          case StoreChanged.unchanged: {
            this.handlePublishWithArticle(loading);
            break;
          }
        }
        break;
      }
      default: {
        this.handlePublish(loading);
      }
    }
  };

  draft = (loading: "updateLoading" | "draftLoading"): void => {
    const { mode, page } = this.props;
    const config = Config.getAll();

    if (isCloud(config) && isShopify(config)) {
      switch (mode) {
        case "withTemplate":
        case "withRules":
        case "withArticle": {
          switch (page.status) {
            case "draft":
              this.handleDraft(loading);
              break;
            case "publish":
              this.handleDraft(loading).then(() =>
                shopifyUnpublishPage(config)
              );
              break;
          }
          break;
        }
        case undefined: {
          this.handleDraft(loading);
        }
      }
    } else {
      this.handleDraft(loading);
    }
  };

  handlePublishWithRules(loading: "updateLoading" | "draftLoading"): void {
    const { page } = this.props;

    const data: PromptsProps = {
      prompt: "pageRules",
      mode: "single",
      props: {
        headTitle: t("SELECT FOR WHAT THE TEMPLATE IS USED"),
        pageTitle: isShopifyPage(page) ? page.title : undefined,
        selectedLayout: isShopifyPage(page) ? page.layout : undefined,
        onClose: (): void => {
          this.setState({ [loading]: false });
        },
        onSave: (): Promise<void> => {
          return this.handlePublish(loading);
        },
        onCancel: (): void => {
          this.setState({ [loading]: false });
        }
      }
    };
    Prompts.open(data);
  }

  handlePublishWithLayout(loading: "updateLoading" | "draftLoading"): void {
    const { page } = this.props;

    const data: PromptsProps = {
      prompt: "pageTemplate",
      mode: "single",
      props: {
        headTitle: t("YOUR PAGE IS READY TO PUBLISH!"),
        selectedLayout: isShopifyPage(page) ? page.layout : undefined,
        pageTitle: isShopifyPage(page) ? page.title : undefined,
        onClose: (): void => {
          this.setState({ [loading]: false });
        },
        onSave: (): Promise<void> => {
          return this.handlePublish(loading);
        },
        onCancel: (): void => {
          this.setState({ [loading]: false });
        }
      }
    };
    Prompts.open(data);
  }

  handlePublishWithArticle(loading: "updateLoading" | "draftLoading"): void {
    const { page } = this.props;
    const data: PromptsProps = {
      prompt: "pageArticle",
      mode: "single",
      props: {
        headTitle: t("YOUR PAGE IS READY TO PUBLISH!"),
        pageTitle: isShopifyPage(page) ? page.title : undefined,
        selectedLayout: isShopifyPage(page) ? page.layout : undefined,
        onClose: (): void => {
          this.setState({ [loading]: false });
        },
        onSave: (): Promise<void> => {
          return this.handlePublish(loading);
        },
        onCancel: (): void => {
          this.setState({ [loading]: false });
        }
      }
    };
    Prompts.open(data);
  }

  handlePublish(loading: "updateLoading" | "draftLoading"): Promise<void> {
    if (this[loading]) {
      return this[loading] as Promise<void>;
    }

    this.setState({ [loading]: true });

    return (this[loading] = this.props
      .updatePageStatus("publish")
      .then(() => {
        this.props.fetchPageSuccess();
        this.setState({ [loading]: false });
        this[loading] = undefined;
      })
      .catch((e) => {
        if (process.env.NODE_ENV === "development") {
          console.error("could not publish or save page", e);
        }
        ToastNotification.error(t("Could not publish or save page"));
        this.setState({ [loading]: false });
        this[loading] = undefined;
      }));
  }

  handleDraft(loading: "updateLoading" | "draftLoading"): Promise<void> {
    if (this[loading]) {
      return this[loading] as Promise<void>;
    }

    this.setState({ [loading]: true });

    return (this[loading] = this.props
      .updatePageStatus("draft")
      .then(() => {
        this.props.fetchPageSuccess();
        this.setState({ [loading]: false });
        this[loading] = undefined;
      })
      .catch((e) => {
        if (process.env.NODE_ENV === "development") {
          console.error("could not switch to draft", e);
        }
        ToastNotification.error(t("Could not switch to draft"));
        this.setState({ [loading]: false });
        this[loading] = undefined;
      }));
  }

  handleSavePage = async (): Promise<void> => {
    const { pageData, extraFontStyles } = this.props;

    if (this.state.layoutLoading || pageData.items.length === 0) {
      return;
    }

    this.setState({ layoutLoading: true });

    const meta: SavedLayout["meta"] = {
      extraFontStyles,
      type: "normal"
    };
    let screenshotsSupported: boolean;

    try {
      screenshotsSupported = await browserSupports();
    } catch (e) {
      screenshotsSupported = false;
    }

    if (screenshotsSupported) {
      const node = document.querySelector("#brz-ed-page__blocks");
      const { src, width, height } = await makeNodeScreenshot(node).catch(
        () => ({
          src: undefined,
          width: undefined,
          height: undefined
        })
      );

      if (src && isNumber(width) && isNumber(height)) {
        const { id } = await createBlockScreenshot({
          base64: src,
          blockType: "layout"
        }).catch(() => ({ id: undefined }));

        if (id) {
          meta._thumbnailSrc = id;
          meta._thumbnailWidth = width;
          meta._thumbnailHeight = height;
          meta._thumbnailTime = Date.now();
        }
      }
    }

    const data = {
      meta,
      data: pageData,
      dataVersion: 1,
      uid: uuid()
    };
    const config = Config.getAll();
    await createSavedLayout(data, config).catch((e) => {
      ToastNotification.error(t("Could not save layout"));
      console.error(e);
    });

    if (!screenshotsSupported) {
      ToastNotification.warn(
        t("Your block was saved without screenshot, browser is not compatible"),
        5
      );
    }

    this.setState({ layoutLoading: false });
  };

  handleClearPage = (): void => {
    this.props.removeBlocks();
  };

  getTooltipItems(): ControlsProps["addonAfter"] {
    const config = Config.getAll();
    const enabledSavedLayout =
      typeof config.api?.savedLayouts?.create === "function";
    const { page } = this.props;
    const items = [];

    if (!isPopup(config) && !isStory(config)) {
      items.push({
        title: t("Clear Layout"),
        icon: "nc-trash",
        roles: ["admin"],
        onClick: (): void => {
          this.handleClearPage();
        }
      });

      if (enabledSavedLayout) {
        items.push({
          title: t("Save Layout"),
          icon: "nc-save-section",
          loading: this.state.layoutLoading,
          onClick: (): void => {
            this.handleSavePage();
          }
        });
      }
    }

    return [
      ...items,
      {
        title: getTooltipPageTitle(page.status),
        icon: getTooltipPageIcon(page.status),
        loading: this.state.draftLoading,
        onClick: (): void => {
          switch (page.status) {
            case "publish": {
              this.draft("draftLoading");
              break;
            }
            case "draft": {
              this.publish("draftLoading");
              break;
            }
          }
        }
      }
    ];
  }

  getLabel(): string {
    const { page, mode, storeWasChanged } = this.props;

    switch (mode) {
      case "withTemplate":
      case "withRules":
      case "withArticle": {
        return getButtonLabel(storeWasChanged, page.status);
      }
      default: {
        switch (page.status) {
          case "publish": {
            return t("Update");
          }
          case "draft": {
            return t("Save Draft");
          }
        }
      }
    }
  }

  updateOnKeyDown = (e: MouseEvent): void => {
    e.preventDefault();
    const { storeWasChanged, page } = this.props;

    storeWasChanged === "changed" &&
      (page.status === "publish"
        ? this.handlePublish("updateLoading")
        : this.handleDraft("updateLoading"));
  };

  render(): ReactElement {
    const { storeWasChanged } = this.props;

    return (
      <>
        <BottomPanelItem paddingSize="small">
          <Controls
            disabled={storeWasChanged !== "changed"}
            addonAfter={this.getTooltipItems()}
            onClick={(): void => {
              switch (this.props.page.status) {
                case "publish":
                  return this.publish("updateLoading");
                case "draft":
                  return this.draft("updateLoading");
              }
            }}
            loading={this.state.updateLoading}
          >
            {this.getLabel()}
          </Controls>
        </BottomPanelItem>
        <HotKeys
          id="key-helper-update-page"
          keyNames={["ctrl+S", "cmd+S", "right_cmd+S"]}
          onKeyDown={this.updateOnKeyDown}
        />
      </>
    );
  }
}

export default PublishConnector(PublishButton);
