import React, { Component, Fragment } from "react";
import _ from "underscore";
import classnames from "classnames";
import { connect } from "react-redux";
import Config from "visual/global/Config";
import EditorIcon from "visual/component/EditorIcon";
import ScrollPane from "visual/component/ScrollPane";
import { fontSelector, stylesSelector } from "visual/redux/selectors";
import ImageLoad from "../common/ImageLoad";
import { templateThumbnailUrl } from "visual/utils/templates";
import { assetUrl } from "visual/utils/asset";
import {
  getUsedModelsFonts,
  getUsedStylesFonts,
  getBlocksStylesFonts
} from "visual/utils/traverse";
import { t } from "visual/utils/i18n";
import { normalizeFonts } from "visual/utils/fonts";
import { flatMap } from "visual/utils/array";

const proEnabled = Config.get("pro");
const urls = Config.get("urls");
const TRANSITION_DELAY = 500;

const animationStyle = {
  animationName: "fadeIn",
  animationFillMode: "both",
  animationDelay: "200ms",
  animationDuration: "200ms"
};

class Details extends Component {
  static defaultProps = {
    data: {
      pages: []
    },
    onClose: _.noop,
    onAddBlocks: _.noop,
    onBack: _.noop
  };

  state = {
    active: this.props.data.pages[0].id,
    thumbnailHeight: 0,
    transition: 0,
    previewPointer: "none",
    importStyles: false
  };

  thumbnailDetails = React.createRef();

  componentDidMount() {
    this.handleUpdateThumbnail();

    window.addEventListener("resize", this.handleUpdateThumbnail);

    setTimeout(() => {
      this.setState({
        previewPointer: "auto"
      });
    }, 200);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleUpdateThumbnail);
  }

  handleUpdateThumbnail = () => {
    this.setState({
      thumbnailHeight: this.thumbnailDetails.current.clientHeight
    });
  };

  handleBack = () => {
    this.props.onBack();
  };

  handleThumbnailAdd = async () => {
    const {
      data: { name: id },
      projectFonts: usedFonts,
      onAddBlocks,
      onClose
    } = this.props;
    const { active: pageId, importStyles } = this.state;

    const page = await fetch(assetUrl(`templates/resolves/${pageId}.json`));
    const { blocks } = await page.json();
    let styles;

    if (importStyles) {
      const data = await fetch(assetUrl("templates/meta.json"));
      const { templates } = await data.json();

      styles = templates.find(({ name }) => name === id).styles;
    }

    let templateFonts = getUsedModelsFonts({ models: blocks });

    if (importStyles) {
      const fontStyles = flatMap(styles, ({ fontStyles }) => fontStyles);
      const fonts = getUsedStylesFonts(fontStyles);

      templateFonts.push(...fonts);
    }

    const fonts = await normalizeFonts(
      getBlocksStylesFonts(templateFonts, usedFonts)
    );

    onAddBlocks({
      blocks,
      styles,
      fonts,
      currentStyleId: importStyles && styles && styles[0].id
    });
    onClose();
  };

  render() {
    const {
      HeaderSlotLeft,
      projectStyles,
      data: { name: title, pages, styles, pro }
    } = this.props;
    const {
      active,
      thumbnailHeight,
      previewPointer,
      importStyles
    } = this.state;
    const existingTemplate = projectStyles.find(({ id }) =>
      styles.some(({ id: _id }) => _id === id)
    );
    const currentPage = pages.find(({ id }) => id === active);
    const activeSrc = templateThumbnailUrl(currentPage);
    const renderSectionPage = pages.map((el, index) => {
      const className = classnames("brz-ed-popup-two-details-page-select", {
        "brz-ed-popup-two-details-page-select-active-block": el.id === active
      });
      const pageSrc = templateThumbnailUrl(el);

      return (
        <div
          key={index}
          className={className}
          onClick={() => {
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
    const transition = currentPage.thumbnailHeight / TRANSITION_DELAY;
    const pageIsPro = proEnabled && pro;

    return (
      <Fragment>
        <HeaderSlotLeft>
          <div className="brz-ed-popup-two-header__search brz-ed-popup-two-header__search--hidden" />
        </HeaderSlotLeft>
        <div className="brz-ed-popup-two-body__content brz-ed-popup-two-blocks__grid brz-ed-popup-two-details">
          <div className="brz-ed-popup-two-details-left">
            <div
              className="brz-ed-popup-two-details-back"
              onClick={this.handleBack}
            >
              <EditorIcon
                icon="nc-arrow-left"
                className="brz-ed-popup-two-details-back-icon"
              />
              {t("Back to Layouts")}
            </div>
            <div
              ref={this.thumbnailDetails}
              className="brz-ed-popup-two-details-preview"
              style={{
                "--thumbnailHeight": `${thumbnailHeight}px`,
                "--previewPointer": `${previewPointer}`
              }}
            >
              <ImageLoad
                className="brz-ed-popup-two-details-preview-img"
                src={activeSrc}
                style={{
                  ...animationStyle,
                  "--transitionPreview": `transform ${transition}s linear`
                }}
              />
            </div>
          </div>
          <div className="brz-ed-popup-two-details-right">
            <div className="brz-ed-popup-two-details-title">
              <h2 className="brz-ed-popup-two-details-title-name">{title}</h2>
              <div className="brz-ed-popup-two-details-title-count">
                {pages.length} {pages.length > 1 ? t("layouts") : t("layout")}
              </div>
            </div>

            <div className="brz-ed-popup-two-details-page">
              <ScrollPane
                className="brz-ed-scroll--details brz-ed-scroll--medium brz-ed-scroll--new-dark"
                style={{ overflow: "hidden", height: "100%" }}
              >
                {renderSectionPage}
              </ScrollPane>
            </div>
          </div>
          <div className="brz-ed-popup-two-details-footer">
            <div className="brz-ed-popup-two-details-footer-grid">
              {/* <div className="brz-ed-popup-two-details-footer-demo">
                View Live Demo
              </div> */}
              <div className="brz-ed-popup-two-details-footer-render">
                <div className="brz-ed-popup-two-details-footer-radio">
                  {/* <div className="brz-ed-popup-two-details-footer-radio-button">
                    <EditorIcon
                      icon="nc-check"
                      className="brz-ed-popup-two-details-footer-radio-icon"
                    />
                    Replace existing content
                  </div> */}

                  {pageIsPro && styles.length > 0 && !existingTemplate && (
                    <div
                      className="brz-ed-popup-two-details-footer-radio-button"
                      onClick={() => {
                        this.setState({
                          importStyles: !importStyles
                        });
                      }}
                    >
                      <EditorIcon
                        icon={importStyles ? "nc-check" : "nc-uncheck"}
                        className="brz-ed-popup-two-details-footer-radio-icon"
                      />
                      {t("Replace global styling")}
                    </div>
                  )}
                  {!pageIsPro && (
                    <div className="brz-ed-popup-two-details-footer-radio-button brz-ed-popup-two-details-footer-radio-button--pro">
                      {t("Upgrade to PRO to use this layout")}
                    </div>
                  )}
                </div>
                {pageIsPro ? (
                  <div
                    className="brz-ed-popup-two-details-footer-render-button"
                    onClick={this.handleThumbnailAdd}
                  >
                    {t("Import This Layout")}
                  </div>
                ) : (
                  <a
                    className="brz-ed-btn brz-ed-btn-width-2 brz-ed-btn-sm brz-ed-btn-icon brz-ed-btn-icon--left brz-ed-btn-rounded brz-ed-btn-pro"
                    href={urls.upgradeToPro}
                    target="_blank"
                  >
                    <EditorIcon icon="nc-lock" />
                    {t("Get Brizy PRO")}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  projectStyles: stylesSelector(state),
  projectFonts: fontSelector(state)
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Details);
