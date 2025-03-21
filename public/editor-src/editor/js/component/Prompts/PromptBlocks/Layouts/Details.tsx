import { Num } from "@brizy/readers";
import classnames from "classnames";
import { noop } from "es-toolkit";
import { find } from "es-toolkit/compat";
import React, {
  Component,
  ComponentType,
  PropsWithChildren,
  ReactElement,
  ReactNode
} from "react";
import Scrollbars from "react-custom-scrollbars";
import { ConnectedProps, connect } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { LayoutData } from "visual/component/Prompts/PromptBlocks/Layouts/types";
import { PromptBlockTemplate } from "visual/component/Prompts/PromptBlocks/types";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { fontsSelector, stylesSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { Block } from "visual/types/Block";
import { Style } from "visual/types/Style";
import { defaultLayoutsData, defaultStoriesData } from "visual/utils/api";
import { flatMap } from "visual/utils/array";
import { ArrayType } from "visual/utils/array/types";
import { placeholderBlockThumbnailUrl } from "visual/utils/blocks";
import { normalizeFonts } from "visual/utils/fonts/normalizeFonts";
import { normalizeStyles } from "visual/utils/fonts/transform";
import { t } from "visual/utils/i18n";
import {
  getBlocksStylesFonts,
  getUsedModelsFonts,
  getUsedStylesFonts
} from "visual/utils/traverse";
import { Button } from "../../common/Button";
import ImageLoad from "../common/ImageLoad";

const TRANSITION_DELAY = 500;

const animationStyle = {
  animationName: "fadeIn",
  animationFillMode: "both",
  animationDelay: "200ms",
  animationDuration: "200ms"
};

const mapState = (
  state: ReduxState
): {
  projectStyles: ReduxState["styles"];
  projectFonts: ReduxState["fonts"];
} => ({
  projectStyles: stylesSelector(state),
  projectFonts: fontsSelector(state)
});

const connector = connect(mapState);

export interface Props {
  type: "stories" | "layouts";
  data: LayoutData;
  HeaderSlotLeft?: ComponentType<PropsWithChildren<unknown>>;
  onClose: VoidFunction;
  onBack: VoidFunction;
  onAddBlocks: (b: PromptBlockTemplate) => void;
  isPro: boolean;
  upgradeToPro: string;
  config: ConfigCommon;
}

type AllProps = ConnectedProps<typeof connector> & Props;

interface State {
  active: string;
  thumbnailHeight: number;
  transition: number;
  loading: boolean;
  previewPointer: "none" | "auto";
  replaceStyle: boolean;
}

class Details extends Component<AllProps, State> {
  static defaultProps: Props = {
    type: "layouts",
    data: {
      name: "",
      cat: [],
      pages: [],
      pro: false,
      keywords: "",
      layoutId: ""
    },
    onClose: noop,
    onAddBlocks: noop,
    onBack: noop,
    isPro: false,
    upgradeToPro: "",
    config: {} as ConfigCommon
  };

  state: State = {
    active: this.props.data.pages[0].id,
    thumbnailHeight: 0,
    transition: 0,
    previewPointer: "none",
    replaceStyle: false,
    loading: false
  };

  thumbnailDetails = React.createRef<HTMLDivElement>();

  timeoutId: undefined | number;

  isPro = this.props.isPro;

  upgradeToPro = this.props.upgradeToPro;

  getTransition(height: number): number {
    return height / TRANSITION_DELAY;
  }

  hasStyleInProject(): ArrayType<ReduxState["styles"]> | undefined {
    const {
      projectStyles,
      data: { styles }
    } = this.props;

    return projectStyles.find(({ id }) =>
      styles?.some(({ id: _id }) => _id === id)
    );
  }

  componentDidMount(): void {
    this.handleUpdateThumbnail();

    window.addEventListener("resize", this.handleUpdateThumbnail);

    const timeId = setTimeout(() => {
      this.setState({ previewPointer: "auto" });
    }, 200);

    this.timeoutId = Num.read(timeId);
  }

  componentWillUnmount(): void {
    window.removeEventListener("resize", this.handleUpdateThumbnail);
    clearTimeout(this.timeoutId);
  }

  handleUpdateThumbnail = (): void => {
    this.setState({
      thumbnailHeight: this.thumbnailDetails.current?.clientHeight ?? 0
    });
  };

  handleBack = (): void => {
    this.props.onBack();
  };

  handleThumbnailAdd = async (): Promise<void> => {
    try {
      const {
        data,
        projectFonts: usedFonts,
        onAddBlocks,
        onClose,
        config
      } = this.props;
      const { active: pageId, replaceStyle, loading } = this.state;

      if (loading) {
        return;
      }

      this.setState({
        loading: true
      });

      const activePage = find(data.pages, { id: pageId });

      if (!activePage) {
        return;
      }

      const page =
        this.props.type === "layouts"
          ? await defaultLayoutsData(config.api, activePage)
          : await defaultStoriesData(config.api, activePage);

      const { blocks } = page as { blocks: Block[] };
      const modelFonts = getUsedModelsFonts({ models: blocks });

      let styles: undefined | Style[];

      if (!this.hasStyleInProject()) {
        styles = normalizeStyles(data.styles) as unknown as Style[];

        // Check fonts
        const fontStyles = flatMap(styles, ({ fontStyles }) => fontStyles);
        const fonts = getUsedStylesFonts(fontStyles);

        modelFonts.push(...fonts);
      }

      const fonts = await normalizeFonts({
        config,
        renderContext: "editor",
        newFonts: getBlocksStylesFonts(modelFonts, usedFonts)
      });

      this.setState({ loading: false }, () => {
        onAddBlocks({
          blocks,
          styles,
          // @ts-expect-error: is not assignable to type FontPayload<keyof Fonts>
          fonts,
          currentStyleId: replaceStyle ? data.styles?.[0]?.id : undefined
        });
        onClose();
      });
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Something went wrong on getting data"));
    }
  };

  handleReplaceStyling = (): void => {
    this.setState({
      replaceStyle: !this.state.replaceStyle
    });
  };

  renderSlotLeft(children: ReactNode): ReactNode {
    const { HeaderSlotLeft } = this.props;

    if (HeaderSlotLeft) {
      return <HeaderSlotLeft>{children}</HeaderSlotLeft>;
    }

    return children;
  }

  render(): ReactElement {
    const {
      type,
      config,
      data: { name: title, pages, styles = [], pro }
    } = this.props;

    const { active, thumbnailHeight, previewPointer, replaceStyle, loading } =
      this.state;
    const isStory = type === "stories";
    const currentPage = pages.find(({ id }) => id === active);
    const activePageSrc =
      currentPage?.thumbnailSrc ?? placeholderBlockThumbnailUrl(config);

    const renderSectionPage = pages.map((el, index) => {
      const pageSrc = el.thumbnailSrc ?? placeholderBlockThumbnailUrl(config);

      const className = classnames(
        "brz-ed-popup-two-details-page-select",
        isStory && "brz-ed-popup-two-details-page-select-stories",
        {
          "brz-ed-popup-two-details-page-select-active-block": el.id === active
        }
      );

      return (
        <div
          key={index}
          className={className}
          onClick={(): void => {
            this.setState({ active: el.id });
          }}
        >
          <ImageLoad src={pageSrc} style={animationStyle} />
          <div className="brz-ed-popup-two-details-page-select-active">
            {el.title}
          </div>
        </div>
      );
    });
    const pageIsPro = !this.isPro && pro;

    const previewClassName = classnames(
      "brz-ed-popup-two-details-preview",
      isStory && "brz-ed-popup-two-details-preview-stories"
    );

    const pagesBlockClassName = classnames(
      "brz-ed-popup-two-details-right",
      isStory && "brz-ed-popup-two-details-right-stories"
    );

    const detailsBlockClassName = classnames(
      "brz-ed-popup-two-body__content brz-ed-popup-two-blocks__grid brz-ed-popup-two-details",
      isStory && "brz-ed-popup-two-details-stories"
    );

    return (
      <>
        {this.renderSlotLeft(
          <div className="brz-ed-popup-two-header__search brz-ed-popup-two-header__search--hidden" />
        )}
        <div className={detailsBlockClassName}>
          <div className="brz-ed-popup-two-details-left">
            <div
              className="brz-ed-popup-two-details-back"
              onClick={this.handleBack}
            >
              <EditorIcon
                icon="nc-arrow-left"
                className="brz-ed-popup-two-details-back-icon"
              />
              {isStory ? t("Back to Stories") : t("Back to Layouts")}
            </div>
            <div
              ref={this.thumbnailDetails}
              className={previewClassName}
              style={{
                //@ts-expect-error: CSSVariables is missing in ts
                "--thumbnailHeight": `${thumbnailHeight}px`,
                "--previewPointer": `${previewPointer}`
              }}
            >
              {isStory ? (
                <ImageLoad
                  className="brz-ed-popup-two-details-preview-img brz-ed-popup-two-details-preview-img-stories"
                  src={activePageSrc}
                />
              ) : (
                <ImageLoad
                  className="brz-ed-popup-two-details-preview-img"
                  src={activePageSrc}
                  style={{
                    ...animationStyle,
                    "--transitionPreview": `transform ${this.getTransition(
                      currentPage?.thumbnailHeight ?? 0
                    )}s linear`
                  }}
                />
              )}
            </div>
          </div>
          <div className={pagesBlockClassName}>
            <div className="brz-ed-popup-two-details-title">
              <h2 className="brz-ed-popup-two-details-title-name">{title}</h2>
              <div className="brz-ed-popup-two-details-title-count">
                {pages.length}{" "}
                {pages.length > 1
                  ? isStory
                    ? t("stories")
                    : t("layouts")
                  : isStory
                    ? t("story")
                    : t("layout")}
              </div>
            </div>

            <div className="brz-ed-popup-two-details-page">
              <Scrollbars>{renderSectionPage}</Scrollbars>
            </div>
          </div>
          <div className="brz-ed-popup-two-details-footer">
            <div className="brz-ed-popup-two-details-footer-grid">
              <div className="brz-ed-popup-two-details-footer-render">
                <div className="brz-ed-popup-two-details-footer-radio">
                  {pageIsPro ? (
                    <div className="brz-ed-popup-two-details-footer-radio-button brz-ed-popup-two-details-footer-radio-button--pro">
                      {isStory
                        ? t("Upgrade to PRO to use this story")
                        : t("Upgrade to PRO to use this layout")}
                    </div>
                  ) : (
                    styles.length > 0 && (
                      <div
                        className="brz-ed-popup-two-details-footer-radio-button"
                        onClick={this.handleReplaceStyling}
                      >
                        <EditorIcon
                          icon={replaceStyle ? "nc-check" : "nc-uncheck"}
                          className="brz-ed-popup-two-details-footer-radio-icon"
                        />
                        {t("Replace global styling")}
                      </div>
                    )
                  )}
                </div>
                {pageIsPro ? (
                  <Button
                    type="link"
                    color="pro"
                    size={2}
                    href={this.upgradeToPro}
                    target="_blank"
                    leftIcon="nc-lock"
                  >
                    {t("Get a PRO plan")}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    color="teal"
                    size={2}
                    loading={loading}
                    onClick={this.handleThumbnailAdd}
                  >
                    {isStory ? t("Import This Story") : t("Import This Layout")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connector(Details);
