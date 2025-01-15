import classnames from "classnames";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "underscore";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import LazyLoadImage from "visual/component/LazyLoadImage";
import { ProInfo } from "visual/component/ProInfo";
import { authorizedSelector } from "visual/redux/selectors";
import { t } from "visual/utils/i18n";
import { imageWrapperSize } from "visual/utils/image";
import { DownloadBlock } from "./DownloadBlock";
import { TagEditable } from "./TagEditable";
import { TagLists } from "./TagLists";
import { Title } from "./Title";

const MAX_CONTAINER_WIDTH = 292;

const animationStyle = {
  animationName: "fadeIn",
  animationFillMode: "both",
  animationDelay: "200ms",
  animationDuration: "200ms"
};

class Thumbnail extends Component {
  static defaultProps = {
    showRemoveIcon: false,
    showTitle: false,
    data: {},
    animation: false,
    isLayout: false,
    isAuthorized: false,
    tags: undefined,
    showSync: false,
    showDownload: false,
    onAdd: _.noop,
    onRemove: _.noop,
    onImageLoaded: _.noop,
    onSync: _.noop,
    onUpdate: _.noop,
    isPro: false,
    isStory: false,
    upgradeToPro: "",
    config: {}
  };

  static propTypes = {
    showRemoveIcon: PropTypes.bool,
    showTitle: PropTypes.bool,
    blockData: PropTypes.object,
    animation: PropTypes.bool,
    isLayout: PropTypes.bool,
    isAuthorized: PropTypes.bool,
    tags: PropTypes.array,
    showSync: PropTypes.bool,
    showDownload: PropTypes.bool,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onImageLoaded: PropTypes.func,
    onSync: PropTypes.func,
    onUpdate: PropTypes.func,
    isPro: PropTypes.bool,
    isStory: PropTypes.bool
  };

  state = {
    tooltipOpen: false,
    blockTooltipOpen: false,
    category: ""
  };

  iconRef = React.createRef();

  isPro = this.props.isPro;

  getProUrl() {
    const { upgradeToPro } = this.props;
    return upgradeToPro;
  }

  getTags() {
    const { tags, data } = this.props;

    if (!tags) {
      return undefined;
    }

    const dataTags = data.tags?.split(",") ?? [];

    return tags.reduce(
      (acc, curr) => ({
        ...acc,
        [curr]: dataTags.includes(curr)
      }),
      {}
    );
  }

  handleTagsTooltipOpen = () => {
    this.setState({ blockTooltipOpen: true });
  };

  handleTagsTooltipClose = () => {
    this.setState({ blockTooltipOpen: false });
  };

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

  handleTitleChange = _.debounce((value) => {
    const { data, onUpdate } = this.props;

    onUpdate({
      ...data,
      title: value,
      dataVersion: data.dataVersion + 1
    });
  }, 1000);

  handleChangeCategory = (value) => {
    this.setState({ category: value });
  };

  handleAddCategory = () => {
    const { data, onUpdate } = this.props;
    const { category } = this.state;
    const dataTags = data.tags?.split(",").filter((t) => !!t) ?? [];

    if (category.trim().length > 0) {
      onUpdate({
        ...data,
        tags: [...dataTags, category].join(","),
        dataVersion: data.dataVersion + 1
      });

      this.setState({ category: "" });
    }
  };

  updateCategory = (tag, checked) => {
    const { data, onUpdate } = this.props;
    const dataTags = data.tags?.split(",").filter((t) => !!t) ?? [];
    const newTags = checked
      ? [...dataTags, tag]
      : dataTags.filter((_tag) => _tag !== tag);

    onUpdate({
      ...data,
      tags: newTags.join(","),
      dataVersion: data.dataVersion + 1
    });
  };

  renderBlank() {
    const {
      data: { pro }
    } = this.props;
    const blankIsPro = !this.isPro && pro;
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
          offset={5}
          openOnClick={false}
          nodeRef={this.iconRef}
          overlay={
            <ProInfo
              text={t("Upgrade to PRO to use this block")}
              url={this.getProUrl()}
            />
          }
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
        offset={5}
        openOnClick={false}
        nodeRef={this.iconRef}
        overlay={
          <ProInfo
            text={t("Upgrade to PRO to use this block")}
            url={this.getProUrl()}
          />
        }
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

  renderTagsOverlay(_tags) {
    const tags = Object.entries(_tags);

    return (
      <>
        {tags.map(([name, checked], index) => {
          return (
            <TagLists
              key={index}
              name={name}
              checked={checked}
              onChange={(v) => this.updateCategory(name, v)}
            />
          );
        })}

        <TagEditable
          value={this.state.category}
          onAdd={this.handleAddCategory}
          onChange={this.handleChangeCategory}
        />
      </>
    );
  }

  renderTags() {
    const tags = this.getTags();

    if (!tags) {
      return undefined;
    }

    return (
      <Tooltip
        arrow={false}
        size="small"
        placement="bottom-start"
        offset={5}
        overlay={this.renderTagsOverlay(tags)}
        openOnClick={true}
        onOpen={this.handleTagsTooltipOpen}
        onClose={this.handleTagsTooltipClose}
      >
        <EditorIcon icon="nc-saved-block-tags" />
      </Tooltip>
    );
  }

  renderTitle() {
    const {
      data: { title }
    } = this.props;

    return <Title value={title} onChange={this.handleTitleChange} />;
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
      const title = synchronized
        ? t("Block is synchronized")
        : t("Block will be synchronized");

      return (
        <div title={title} className={className} onClick={this.handleSync}>
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

  renderDownloadIcon() {
    const { uid, type } = this.props.data;
    return <DownloadBlock id={uid} type={type} config={this.props.config} />;
  }

  render() {
    const {
      isLayout,
      showSync,
      showTitle,
      showDownload,
      tags,
      data: { blank, showRemoveIcon, pro, loading, inactive, renderWrapper },
      isStory
    } = this.props;
    const { blockTooltipOpen } = this.state;
    const showDownLine = showTitle || showDownload || tags;
    const blockIsPro = !this.isPro && pro;
    const isBlank =
      (typeof blank === "string" && blank === "blank") ||
      (typeof blank === "boolean" && blank);
    const className = classnames(
      "brz-ed-popup-two-block",
      isStory && "brz-ed-popup-two-block-stories",
      blockIsPro && "brz-ed-popup-two-block--pro",
      isLayout && "brz-ed-popup-two-block--layout",
      inactive && "inactive",
      blockTooltipOpen && "brz-ed-popup-two-block-tags-opened"
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
        {(showSync || showDownLine) && !isBlank && (
          <div className="brz-ed-popup-two-block__bottom-control">
            {showSync && this.renderSyncIcon()}
            {showDownLine && (
              <div className="brz-ed-popup-two-block__bottom-control-downline">
                {showTitle && this.renderTitle()}
                {showDownload && this.renderDownloadIcon()}
                {tags && this.renderTags()}
              </div>
            )}
          </div>
        )}
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
      data: { name, pagesCount },
      isStory,
      config,
      ...otherProps
    } = this.props;
    const { thumbnailLoaded } = this.state;

    const infoClassName = classnames(
      "brz-ed-popup-two-block-info",
      isStory && "brz-ed-popup-two-block-info-stories"
    );

    return (
      <div
        className={infoClassName}
        style={thumbnailLoaded ? animationStyle : {}}
      >
        <Thumbnail
          {...otherProps}
          data={this.props.data}
          isLayout={true}
          isStory={isStory}
          onImageLoaded={this.handleLoaded}
          config={config}
        />
        <div className="brz-ed-popup-two-block-info-downline">
          <div className="brz-ed-popup-two-block-info-title">{name}</div>
          <div className="brz-ed-popup-two-block-info-title">
            {pagesCount}{" "}
            {pagesCount > 1
              ? isStory
                ? t("stories")
                : t("layouts")
              : isStory
                ? t("story")
                : t("layout")}
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  isAuthorized: authorizedSelector(state) === "connected"
});
const LayoutThumbnail = connect(mapStateToProps)(Layout);

export default connect(mapStateToProps)(Thumbnail);
export { LayoutThumbnail };
