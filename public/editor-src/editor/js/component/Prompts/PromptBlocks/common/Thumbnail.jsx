import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Config from "visual/global/Config";
import LazyLoadImage from "visual/component/LazyLoadImage";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import { imageWrapperSize } from "visual/utils/image";
import { authorizedSelector } from "visual/redux/selectors2";
import { t } from "visual/utils/i18n";

const MAX_CONTAINER_WIDTH = 292;

const animationStyle = {
  animationName: "fadeIn",
  animationFillMode: "both",
  animationDelay: "200ms",
  animationDuration: "200ms"
};
const IS_PRO = Config.get("pro");
const ConfigUrl = Config.get("urls");

class Thumbnail extends Component {
  static defaultProps = {
    showRemoveIcon: false,
    data: {},
    animation: false,
    isLayout: false,
    isAuthorized: false,
    showSync: false,
    onAdd: _.noop,
    onRemove: _.noop,
    onImageLoaded: _.noop,
    onSync: _.noop
  };

  static propTypes = {
    showRemoveIcon: PropTypes.bool,
    blockData: PropTypes.object,
    animation: PropTypes.bool,
    isLayout: PropTypes.bool,
    isAuthorized: PropTypes.bool,
    showSync: PropTypes.bool,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onImageLoaded: PropTypes.func,
    onSync: PropTypes.func
  };

  state = {
    tooltipOpen: false
  };

  iconRef = React.createRef();

  handleTooltipOpen = () => {
    this.setState({ tooltipOpen: true });
  };

  handleTooltipClose = () => {
    this.setState({ tooltipOpen: false });
  };

  handleClick = () => {
    const { data, onAdd } = this.props;

    if (!data.loading && !data.inactive) {
      onAdd(data);
    }
  };

  handleRemove = () => {
    const { data, onRemove } = this.props;

    onRemove(data);
  };

  handleSync = () => {
    const { data, onSync } = this.props;

    onSync(data);
  };

  renderProInfo() {
    return (
      <div className="brz-ed-tooltip-content__pro">
        <p className="brz-p brz-ed-tooltip-content__pro-title">
          {t("You’ll need Brizy PRO to use this block")}
        </p>
        <p className="brz-p brz-ed-tooltip-content__pro-body">
          <a
            className="brz-a"
            href={ConfigUrl.upgradeToPro}
            target="_blank"
            rel="noopener noreferrer"
          >
            <EditorIcon icon="nc-lock" />
            {t("Get Brizy PRO")}
          </a>
        </p>
      </div>
    );
  }

  renderBlank() {
    const {
      data: { pro }
    } = this.props;
    const blankIsPro = !IS_PRO && pro;
    const title = this.props.data?.blankTitle ?? t("Create your own");
    const className = classnames(
      "brz-ed-popup-two-block-item",
      "brz-ed-popup-two-block__blank",
      "brz-ed-popup-two-block__blank-first",
      { "brz-ed-popup-two-block__blank--pro": blankIsPro }
    );

    if (blankIsPro) {
      return (
        <Tooltip
          overlayClassName="brz-ed-tooltip--delay-1"
          size="small"
          offset="5"
          openOnClick={false}
          nodeRef={this.iconRef}
          overlay={this.renderProInfo()}
          onOpen={this.handleTooltipOpen}
          onClose={this.handleTooltipClose}
        >
          <div className={className}>
            <p
              ref={this.iconRef}
              className="brz-p brz-d-xs-flex brz-align-items-xs-center"
            >
              <EditorIcon icon="nc-lock" /> {title}
            </p>
            <p className="brz-p brz-ed-badge brz-ed-badge--pro">pro</p>
          </div>
        </Tooltip>
      );
    }

    return (
      <div onClick={this.handleClick} className={className}>
        <div className="brz-ed-container-trigger brz-ed-container-trigger--small" />
        <p className="brz-p">{title}</p>
      </div>
    );
  }

  renderPro() {
    const {
      animation,
      isLayout,
      data: { thumbnailSrc, thumbnailWidth, thumbnailHeight },
      onImageLoaded
    } = this.props;
    const { width, height } = imageWrapperSize(
      thumbnailWidth,
      thumbnailHeight,
      MAX_CONTAINER_WIDTH
    );
    const className = classnames(
      "brz-figure brz-ed-popup-two-block-item",
      this.state.tooltipOpen && "brz-ed-popup-two-block-item--active"
    );
    const content = (
      <>
        <LazyLoadImage
          observerRootSelector=".brz-ed-popup-two-blocks-body"
          style={animation ? animationStyle : {}}
          src={thumbnailSrc}
          width={width}
          height={height}
          onImageLoaded={onImageLoaded}
        />
        <p className="brz-p brz-ed-badge brz-ed-badge--pro">pro</p>
      </>
    );

    return isLayout ? (
      <figure className={className} onClick={this.handleClick}>
        {content}
      </figure>
    ) : (
      <Tooltip
        overlayClassName="brz-ed-tooltip--delay-1"
        size="small"
        offset="5"
        openOnClick={false}
        nodeRef={this.iconRef}
        overlay={this.renderProInfo()}
        onOpen={this.handleTooltipOpen}
        onClose={this.handleTooltipClose}
      >
        <figure className={className}>
          {content}
          <span
            ref={this.iconRef}
            className="brz-ed-popup-two-block__span-lock"
          >
            <EditorIcon icon="nc-lock" />
          </span>
        </figure>
      </Tooltip>
    );
  }

  renderFree() {
    const {
      animation,
      data: { thumbnailSrc, thumbnailWidth, thumbnailHeight },
      onImageLoaded
    } = this.props;
    const { width, height } = imageWrapperSize(
      thumbnailWidth,
      thumbnailHeight,
      MAX_CONTAINER_WIDTH
    );

    return (
      <figure
        className="brz-figure brz-ed-popup-two-block-item"
        onClick={this.handleClick}
      >
        <LazyLoadImage
          observerRootSelector=".brz-ed-popup-two-blocks-body"
          style={animation ? animationStyle : {}}
          src={thumbnailSrc}
          width={width}
          height={height}
          onImageLoaded={onImageLoaded}
        />
      </figure>
    );
  }

  renderRemoveIcon() {
    return (
      <div
        className="brz-ed-badge__delete brz-ed-popup-two-block-remove"
        onClick={this.handleRemove}
      >
        <EditorIcon icon="nc-trash" />
      </div>
    );
  }

  renderSyncIcon() {
    const {
      isAuthorized,
      data: { synchronizable, synchronized }
    } = this.props;

    if (synchronizable && isAuthorized) {
      const className = classnames("brz-ed-popup-two-block-sync", {
        "brz-ed-popup-two-block-sync--uploaded": synchronized
      });

      return (
        <div className={className} onClick={this.handleSync}>
          <EditorIcon
            icon={synchronized ? "nc-check-circle-on" : "nc-reverse-glyph"}
          />
        </div>
      );
    }
  }

  renderLoading() {
    return (
      <div className="brz-ed-popup-two-block--loading">
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </div>
    );
  }

  render() {
    const {
      isLayout,
      showSync,
      data: { blank, showRemoveIcon, pro, loading, inactive, renderWrapper }
    } = this.props;
    const blockIsPro = !IS_PRO && pro;
    const isBlank = blank && blank === "blank";
    const className = classnames(
      "brz-ed-popup-two-block",
      blockIsPro && "brz-ed-popup-two-block--pro",
      isLayout && "brz-ed-popup-two-block--layout",
      inactive && "inactive"
    );

    let content;
    if (isBlank) {
      content = this.renderBlank();
    } else {
      content = blockIsPro ? this.renderPro() : this.renderFree();

      if (renderWrapper) {
        content = renderWrapper(content);
      }
    }

    return (
      <div className={className}>
        {content}
        {showRemoveIcon && this.renderRemoveIcon()}
        {loading && this.renderLoading()}
        {showSync && this.renderSyncIcon()}
      </div>
    );
  }
}

class Layout extends Component {
  state = {
    thumbnailLoaded: false
  };

  handleLoaded = () => {
    this.setState({
      thumbnailLoaded: true
    });
  };

  render() {
    const {
      data: { name, pages, color },
      ...otherProps
    } = this.props;
    const { thumbnailLoaded } = this.state;

    return (
      <div
        className="brz-ed-popup-two-block-info"
        style={thumbnailLoaded ? animationStyle : {}}
      >
        <Thumbnail
          {...otherProps}
          data={this.props.data}
          isLayout={true}
          onImageLoaded={this.handleLoaded}
        />
        {thumbnailLoaded && pages.length > 1 && (
          <span
            className="brz-ed-popup-two-block-info-color"
            style={{ backgroundColor: color }}
          >
            <span
              className="brz-ed-popup-two-block-info-color-opacity"
              style={{ backgroundColor: color }}
            />
          </span>
        )}
        <div className="brz-ed-popup-two-block-info-downline">
          <div className="brz-ed-popup-two-block-info-title">{name}</div>
          <div className="brz-ed-popup-two-block-info-title">
            {pages.length} {pages.length > 1 ? t("layouts") : t("layout")}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  isAuthorized: authorizedSelector(state) === "connected"
});
const LayoutThumbnail = connect(mapStateToProps)(Layout);

export default connect(mapStateToProps)(Thumbnail);
export { LayoutThumbnail };
