import React, { Component, Fragment } from "react";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import ScrollPane from "visual/component/ScrollPane";
import ImageLoad from "../common/ImageLoad";
import { templateThumbnailUrl } from "visual/utils/templates";
import { t } from "visual/utils/i18n";

const TRANSITION_DELAY = 500;

const animationStyle = {
  animationName: "fadeIn",
  animationFillMode: "both",
  animationDelay: "200ms",
  animationDuration: "200ms"
};

export default class Details extends Component {
  static defaultProps = {
    data: {
      pages: []
    },
    onAddBlocks: _.noop,
    onBack: _.noop
  };

  state = {
    active: this.props.data.pages[0].id,
    thumbnailHeight: 0,
    transition: 0,
    previewPointer: "none"
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

  handleThumbnailAdd = () => {
    const {
      data: { pages },
      onAddBlocks,
      onClose
    } = this.props;
    const { blocks } = pages.find(({ id }) => id === this.state.active).resolve;

    onAddBlocks(blocks);
    onClose();
  };

  render() {
    const {
      HeaderSlotLeft,
      data: { pages, name: title }
    } = this.props;
    const { active, thumbnailHeight, previewPointer } = this.state;
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
                {/* <div className="brz-ed-popup-two-details-footer-radio">
                  <div className="brz-ed-popup-two-details-footer-radio-button">
                    <EditorIcon
                      icon="nc-check"
                      className="brz-ed-popup-two-details-footer-radio-icon"
                    />
                    Replace existing content
                  </div>
                  <div className="brz-ed-popup-two-details-footer-radio-button">
                    <EditorIcon
                      icon="nc-uncheck"
                      className="brz-ed-popup-two-details-footer-radio-icon"
                    />
                    Replace global styling
                  </div>
                </div> */}
                <div
                  className="brz-ed-popup-two-details-footer-render-button"
                  onClick={this.handleThumbnailAdd}
                >
                  {t("Import This Layout")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
