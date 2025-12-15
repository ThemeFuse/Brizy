import { match } from "fp-utilities";
import React, { Component, JSX, ReactElement } from "react";
import { ConnectedProps, connect } from "react-redux";
import HotKeys from "visual/component/HotKeys";
import { ToastNotification } from "visual/component/Notifications";
import Prompts, { PromptsProps } from "visual/component/Prompts";
import {
  canSyncPage,
  getPromptPageArticleHeadTitle,
  getPromptPageRulesHeadTitle
} from "visual/component/Prompts/utils";
import {
  Shopify,
  isCMS,
  isCloud,
  isShopify,
  isShopifyPage
} from "visual/global/Config/types/configs/Cloud";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { isWp } from "visual/global/Config/types/configs/WP";
import { getShopifyTemplate } from "visual/global/Config/types/shopify/ShopifyTemplate";
import { useConfig } from "visual/providers/ConfigProvider";
import {
  EditorMode,
  EditorModeContext,
  isPopup,
  isStory
} from "visual/providers/EditorModeProvider";
import {
  fetchPageSuccess,
  removeBlocks,
  updateError,
  updatePageStatus
} from "visual/redux/actions2";
import {
  blocksHtmlSelector,
  extraFontStylesSelector,
  pageDataNoRefsSelector2,
  pageSelector,
  storeWasChangedSelector
} from "visual/redux/selectors";
import { ReduxState, StoreChanged } from "visual/redux/types";
import { SavedLayout } from "visual/types";
import { Style } from "visual/types/Style";
import {
  createBlockScreenshot,
  createSavedLayout,
  getCollectionSourceItemsById,
  getPageRelations,
  shopifyBlogItems,
  shopifySyncArticle,
  shopifySyncPage,
  shopifySyncRules,
  shopifyUnpublishPage
} from "visual/utils/api";
import { SelectedItem } from "visual/utils/api/types";
import { ErrorCodes } from "visual/utils/errors";
import { t } from "visual/utils/i18n";
import { makeBzelmAttr } from "visual/utils/i18n/attribute";
import { isNumber } from "visual/utils/math";
import { browserSupports, makeNodeScreenshot } from "visual/utils/screenshots";
import { uuid } from "visual/utils/uuid";
import { MValue } from "visual/utils/value";
import { BottomPanelItem } from "../Item";
import { Controls, Props as ControlsProps } from "./Control";
import {
  Mode,
  getButtonLabel,
  getMode,
  getTooltipPageIcon,
  getTooltipPageTitle,
  isTemplateOrRulesMode
} from "./utils";

type Page = ReduxState["page"];

type LoadingType = "updateLoading" | "draftLoading" | "saveAndPublishLoading";

const _getMode = match(
  [isCloud, match([isShopify, getMode], [isCMS, (): undefined => undefined])],
  [isWp, (): undefined => undefined]
);

const mapState = (
  state: ReduxState
): {
  page: Page;
  getPageData: (config: ConfigCommon) => Page["data"];
  extraFontStyles: ReduxState["extraFontStyles"];
  storeWasChanged: StoreChanged;
  currentStyle: Style;
  compilationProcess: boolean;
} => {
  return {
    page: pageSelector(state),
    getPageData: (config: ConfigCommon) =>
      pageDataNoRefsSelector2(state, config),
    extraFontStyles: extraFontStylesSelector(state),
    storeWasChanged: storeWasChangedSelector(state),
    currentStyle: state.currentStyle,
    compilationProcess: blocksHtmlSelector(state).inPending
  };
};
const mapDispatch = {
  updatePageStatus,
  removeBlocks,
  fetchPageSuccess,
  updateError
};
const PublishConnector = connect(mapState, mapDispatch);

interface Props extends ConnectedProps<typeof PublishConnector> {
  config: ConfigCommon;
}

interface State {
  updateLoading: boolean;
  layoutLoading: boolean;
  draftLoading: boolean;

  [key: string]: boolean;
}

class _PublishButton extends Component<Props, State> {
  state = {
    updateLoading: false,
    layoutLoading: false,
    draftLoading: false,
    saveAndPublishLoading: false,
    readyForPublish: false
  };

  draftLoading: Promise<void> | undefined;
  updateLoading: Promise<void> | undefined;
  saveAndPublishLoading: Promise<void> | undefined;

  configComputedValues: {
    isCloud: boolean;
    isShopify: boolean;
    isEnabledSavedLayouts: boolean;
    mode: MValue<Mode>;
  };

  pendingToPublish?: {
    status: "draft" | "publish";
    type: LoadingType;
    mode: EditorMode;
  };

  constructor(props: Props) {
    super(props);
    this.configComputedValues = this.getValuesByConfig();
  }

  componentDidUpdate() {
    this.configComputedValues = this.getValuesByConfig();
    const pendingStatus = this.pendingToPublish;

    if (!this.props.compilationProcess && pendingStatus) {
      switch (pendingStatus.status) {
        case "publish": {
          const { mode, type } = pendingStatus;
          this.pendingToPublish = undefined;
          this.handlePublish(type, mode);
          break;
        }
        case "draft": {
          const { mode, type } = pendingStatus;
          this.pendingToPublish = undefined;
          this.handleDraft(type, mode);
          break;
        }
      }
    }
  }

  publish = (
    loading: "updateLoading" | "draftLoading",
    editorMode: EditorMode
  ): void => {
    const { storeWasChanged } = this.props;
    const { mode, isShopify } = this.configComputedValues;

    switch (mode) {
      case "withTemplate": {
        switch (storeWasChanged) {
          case StoreChanged.changed: {
            this.handlePublish(loading, editorMode);
            break;
          }
          case StoreChanged.unchanged: {
            this.handlePublishWithLayout(loading, editorMode);
            break;
          }
        }
        break;
      }
      case "withRules": {
        switch (storeWasChanged) {
          case StoreChanged.changed: {
            this.handlePublish(loading, editorMode);
            break;
          }
          case StoreChanged.unchanged: {
            this.handlePublishWithRules(loading, editorMode);
            break;
          }
        }
        break;
      }
      case "withArticle": {
        switch (storeWasChanged) {
          case StoreChanged.changed: {
            this.handlePublish(loading, editorMode);
            break;
          }
          case StoreChanged.unchanged: {
            this.handlePublishWithArticle(loading, editorMode);
            break;
          }
        }
        break;
      }
      default: {
        this.handlePublish(loading, editorMode);
      }
    }

    if (isShopify) {
      this.setState({ readyForPublish: true });
    }
  };

  draft = (
    loading: "updateLoading" | "draftLoading",
    editorMode: EditorMode
  ): void => {
    const { page } = this.props;
    const { mode, isShopify } = this.configComputedValues;
    const config = this.getConfig();

    if (isShopify) {
      switch (mode) {
        case "withTemplate":
        case "withRules":
        case "withArticle": {
          switch (page.status) {
            case "draft":
              this.handleDraft(loading, editorMode);
              break;
            case "publish":
              this.handleDraft(loading, editorMode).then(() =>
                shopifyUnpublishPage(config)
              );
              break;
          }
          break;
        }
        case undefined: {
          this.handleDraft(loading, editorMode);
        }
      }
    } else {
      this.handleDraft(loading, editorMode);
    }
  };

  handlePublishWithRules(
    loading: "updateLoading" | "draftLoading" | "saveAndPublishLoading",
    editorMode: EditorMode
  ): void {
    const { page } = this.props;
    const config = this.getConfig();
    const templateType = getShopifyTemplate(config);

    const data: PromptsProps = {
      prompt: "pageRules",
      mode: "single",
      props: {
        headTitle: getPromptPageRulesHeadTitle(templateType),
        pageTitle: isShopifyPage(page, config) ? page.title : undefined,
        selectedLayout: isShopifyPage(page, config) ? page.layout : undefined,
        onClose: (): void => {
          this.setState({ [loading]: false });
        },
        onSave: (): Promise<void> => {
          return this.handlePublish(loading, editorMode);
        },
        onAfterSave: () => {
          this.setState({ readyForPublish: false });
          Prompts.close("pageRules");
        },
        onCancel: (): void => {
          this.setState({ [loading]: false });
        }
      }
    };
    Prompts.open(data);
  }

  handlePublishWithLayout(
    loading: "updateLoading" | "draftLoading",
    editorMode: EditorMode
  ): void {
    const { page } = this.props;
    const config = this.getConfig();

    const data: PromptsProps = {
      prompt: "pageTemplate",
      mode: "single",
      props: {
        pageId: page.id,
        headTitle: t("YOUR PAGE IS READY TO BE PUBLISHED"),
        selectedLayout: isShopifyPage(page, config) ? page.layout : undefined,
        pageTitle: isShopifyPage(page, config) ? page.title : undefined,
        onClose: (): void => {
          this.setState({ [loading]: false });
        },
        onSave: (): Promise<void> => {
          return this.handlePublish(loading, editorMode);
        },
        onAfterSave: () => {
          this.setState({ readyForPublish: false });
          Prompts.close("pageTemplate");
        },
        onCancel: (): void => {
          this.setState({ [loading]: false });
        }
      }
    };
    Prompts.open(data);
  }

  handlePublishWithArticle(loading: LoadingType, editorMode: EditorMode): void {
    const { page } = this.props;
    const config = this.getConfig();
    const templateType = getShopifyTemplate(config);

    const data: PromptsProps = {
      prompt: "pageArticle",
      mode: "single",
      props: {
        headTitle: getPromptPageArticleHeadTitle(templateType),
        pageTitle: isShopifyPage(page, config) ? page.title : undefined,
        selectedLayout: isShopifyPage(page, config) ? page.layout : undefined,
        onClose: (): void => {
          this.setState({ [loading]: false });
        },
        onSave: (): Promise<void> => {
          return this.handlePublish(loading, editorMode);
        },
        onAfterSave: () => {
          this.setState({ readyForPublish: false });
          Prompts.close("pageArticle");
        },
        onCancel: (): void => {
          this.setState({ [loading]: false });
        }
      }
    };
    Prompts.open(data);
  }

  handlePublish(loading: LoadingType, editorMode: EditorMode): Promise<void> {
    const { compilationProcess } = this.props;

    if (compilationProcess) {
      if (this.state[loading]) {
        return Promise.resolve();
      }

      this.pendingToPublish = {
        status: "publish",
        type: loading,
        mode: editorMode
      };
      this.setState({ [loading]: true });
      return Promise.resolve();
    }

    if (this[loading]) {
      return this[loading] as Promise<void>;
    }

    this.setState({ [loading]: true });

    return (this[loading] = this.props
      .updatePageStatus({
        status: "publish",
        editorMode: editorMode,
        config: this.props.config
      })
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

  handleDraft(loading: LoadingType, editorMode: EditorMode): Promise<void> {
    const { compilationProcess } = this.props;

    if (compilationProcess) {
      if (this.state[loading]) {
        return Promise.resolve();
      }

      this.pendingToPublish = {
        status: "draft",
        type: loading,
        mode: editorMode
      };
      this.setState({ [loading]: true });
      return Promise.resolve();
    }

    if (this[loading]) {
      return this[loading] as Promise<void>;
    }

    if (!this.state[loading]) {
      this.setState({ [loading]: true });
    }

    const { status } = this.props.page;
    const pageStatus = status === "future" ? "future" : "draft";

    return (this[loading] = this.props
      .updatePageStatus({
        status: pageStatus,
        editorMode: editorMode,
        config: this.props.config
      })
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
    const { getPageData, extraFontStyles, currentStyle } = this.props;
    const config = this.getConfig();

    const pageData = getPageData(config);

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
    } catch (_) {
      screenshotsSupported = false;
    }

    if (screenshotsSupported) {
      const node = document.querySelector("#brz-ed-page__blocks");
      const { src, width, height } = await makeNodeScreenshot(
        node,
        config
      ).catch(() => ({
        src: undefined,
        width: undefined,
        height: undefined
      }));

      if (src && isNumber(width) && isNumber(height)) {
        const { id } = await createBlockScreenshot(
          { base64: src, blockType: "layout" },
          config
        ).catch(() => ({ id: undefined }));

        if (id) {
          meta._thumbnailSrc = id;
          meta._thumbnailWidth = width;
          meta._thumbnailHeight = height;
          meta._thumbnailTime = Date.now();
        }
      }
    }

    const layoutId = uuid();

    const data = {
      meta,
      data: pageData,
      dataVersion: 1,
      uid: layoutId,
      globalStyles: {
        ...currentStyle,
        id: layoutId,
        title: currentStyle.title + "-" + layoutId.slice(0, 4)
      }
    };
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
    this.props.removeBlocks({
      config: this.props.config
    });
  };

  getSaveAndPublishOption(editorMode: EditorMode) {
    const { page, updateError } = this.props;
    const { mode, isShopify } = this.configComputedValues;
    const config = this.getConfig();

    return {
      title: t("Save & Publish"),
      icon: "nc-shopify-logo",
      loading: this.state.saveAndPublishLoading,
      onClick: async () => {
        if (isShopify && isShopifyPage(page, config)) {
          const canSync = canSyncPage(config);
          const syncErrorData = {
            upgradeToProUrl: (config as ConfigCommon)?.modules?.shop
              ?.upgradeToProUrl
          };
          const layout = page.layout.value;

          this.setState({ updateLoading: true });
          try {
            switch (mode) {
              case "withTemplate": {
                await this.handlePublish("saveAndPublishLoading", editorMode);

                if (!canSync) {
                  updateError({
                    code: ErrorCodes.SYNC_ERROR,
                    data: syncErrorData
                  });
                  break;
                }

                const isHomePage = page.id === page?.layout?.isHomePage;
                await shopifySyncPage({
                  modules: (config as Shopify).modules,
                  page: (config as Shopify).page,
                  title: page.title,
                  isHomePage,
                  layout
                });

                break;
              }
              case "withRules": {
                const selected = await getPageRelations(config.modules);
                const selectedIds = selected.map((i) => i.id);
                const _items = await getCollectionSourceItemsById(
                  config.templateType,
                  config.api
                );

                const items = _items.filter((item): item is SelectedItem =>
                  selectedIds.includes(item.id)
                );

                if (items.length > 0) {
                  await this.handlePublish("saveAndPublishLoading", editorMode);

                  if (!canSync) {
                    updateError({
                      code: ErrorCodes.SYNC_ERROR,
                      data: syncErrorData
                    });
                    break;
                  }

                  await shopifySyncRules({
                    page: config.page,
                    modules: config.modules,
                    rules: items,
                    title: page.title,
                    layout
                  });
                } else {
                  this.handlePublishWithRules(
                    "saveAndPublishLoading",
                    editorMode
                  );
                }
                break;
              }
              case "withArticle": {
                const selected = await getPageRelations(config.modules);
                const selectedIds = selected.map((i) => i.blog_id || i.id);

                const items = await shopifyBlogItems(config);

                const selectedBlog = items.find((blog) =>
                  selectedIds.includes(blog.id)
                );

                if (selectedBlog?.id && selectedBlog?.title) {
                  await this.handlePublish("saveAndPublishLoading", editorMode);

                  if (!canSync) {
                    updateError({
                      code: ErrorCodes.SYNC_ERROR,
                      data: syncErrorData
                    });
                    break;
                  }

                  await shopifySyncArticle({
                    config,
                    blogId: selectedBlog.id,
                    blogTitle: selectedBlog.title,
                    title: page.title,
                    layout
                  });
                } else {
                  this.handlePublishWithArticle(
                    "saveAndPublishLoading",
                    editorMode
                  );
                }
                break;
              }
            }
          } catch (_) {
            ToastNotification.error(t("Something went wrong on publish"));
          }

          this.setState({ updateLoading: false, readyForPublish: false });
        }
      }
    };
  }

  getTooltipItems(editorMode: EditorMode): ControlsProps["addonAfter"] {
    const { page } = this.props;
    const { mode, isEnabledSavedLayouts } = this.configComputedValues;

    const items = [];

    if (!isPopup(editorMode) && !isStory(editorMode)) {
      items.push({
        title: t("Clear Layout"),
        icon: "nc-trash",
        roles: ["admin"],
        onClick: (): void => {
          this.handleClearPage();
        }
      });

      if (isEnabledSavedLayouts) {
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
        attr: this.getBzelmAttr(true),
        onClick: (): void => {
          switch (page.status) {
            case "publish": {
              this.draft("draftLoading", editorMode);
              break;
            }
            case "draft": {
              this.publish("draftLoading", editorMode);
              break;
            }
          }
        }
      },
      ...(isTemplateOrRulesMode(mode)
        ? [this.getSaveAndPublishOption(editorMode)]
        : [])
    ];
  }

  getLabel(): string {
    const { page, storeWasChanged } = this.props;
    const { mode } = this.configComputedValues;

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
          case "draft":
          case "future":
          case "private": {
            return t("Save Draft");
          }
        }
      }
    }
  }

  updateOnKeyDown = (e: MouseEvent, editorMode: EditorMode): void => {
    e.preventDefault();
    const { storeWasChanged, page } = this.props;

    storeWasChanged === "changed" &&
      (page.status === "publish"
        ? this.handlePublish("updateLoading", editorMode)
        : this.handleDraft("updateLoading", editorMode));
  };

  render(): ReactElement {
    const { storeWasChanged } = this.props;
    const { readyForPublish } = this.state;
    const { isShopify } = this.configComputedValues;
    const attr = this.getBzelmAttr(false);

    const isReadyForPublish = isShopify ? !readyForPublish : true;

    return (
      <EditorModeContext.Consumer>
        {({ mode }) => (
          <>
            <BottomPanelItem paddingSize="small">
              <Controls
                disabled={
                  storeWasChanged !== StoreChanged.changed && isReadyForPublish
                }
                addonAfter={this.getTooltipItems(mode)}
                onClick={(): void => {
                  switch (this.props.page.status) {
                    case "publish":
                      return this.publish("updateLoading", mode);
                    case "draft":
                    case "future":
                    case "private":
                      return this.draft("updateLoading", mode);
                  }
                }}
                status={this.props.page.status}
                loading={this.state.updateLoading}
                attr={attr}
              >
                {this.getLabel()}
              </Controls>
            </BottomPanelItem>
            <HotKeys
              id="key-helper-update-page"
              keyNames={["ctrl+S", "cmd+S", "right_cmd+S"]}
              onKeyDown={(e: MouseEvent) => this.updateOnKeyDown(e, mode)}
            />
          </>
        )}
      </EditorModeContext.Consumer>
    );
  }

  getConfig() {
    return this.props.config as Shopify;
  }

  getValuesByConfig() {
    const config = this.getConfig();

    return {
      isCloud: isCloud(config),
      isShopify: isCloud(config) && isShopify(config),
      isEnabledSavedLayouts:
        typeof config.api?.savedLayouts?.create === "function",
      mode: _getMode(config)
    };
  }

  getBzelmAttr(forTooltipItem: boolean) {
    const { page } = this.props;

    if (forTooltipItem) {
      return makeBzelmAttr(
        page.status === "publish" ? "switch-to-draft" : "publish-page"
      );
    }

    return makeBzelmAttr(page.status === "publish" ? "update" : "save-draft");
  }
}

const PublishButton = (props: Omit<Props, "config">): JSX.Element => {
  const config = useConfig();

  return <_PublishButton {...props} config={config} />;
};

export default PublishConnector(PublishButton);
