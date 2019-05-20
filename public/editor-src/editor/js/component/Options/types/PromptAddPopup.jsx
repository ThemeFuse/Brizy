import React from "react";
import { connect } from "react-redux";
import _ from "underscore";
import classnames from "classnames";
import deepMerge from "deepmerge";
import Editor from "visual/global/Editor";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import UIState from "visual/global/UIState";
import EditorIcon from "visual/component/EditorIcon";
import { hideToolbar } from "visual/component/Toolbar";
import { SectionPopupInstances } from "visual/editorComponents/SectionPopup";
import { currentContainerBorder } from "visual/component/ContainerBorder";
import { blockThumbnailData } from "visual/utils/blocks";
import { imageWrapperSize } from "visual/utils/image";
import { uuid } from "visual/utils/uuid";
import {
  pageBlocksSelector,
  globalBlocksSelector
} from "visual/redux/selectors";
import { updateGlobalBlock } from "visual/redux/actions";

const MAX_CONTAINER_WIDTH = 140;

const getBlocksConfig = _.memoize(() => {
  const blocksConfig = Editor.getBlocks();
  const popupCategory =
    blocksConfig.categories.find(category => category.slug === "popup") || {};

  const categories = blocksConfig.categories.filter(
    category => category.id === popupCategory.id
  );
  const blocks = blocksConfig.blocks.filter(block =>
    block.cat.includes(popupCategory.id)
  );

  return {
    ...blocksConfig,
    categories,
    blocks,
    allowMissing: block => block.type === "SectionPopup"
  };
});

class PromptAddPopupOptionType extends React.Component {
  static defaultProps = {
    label: "",
    className: "",
    attr: {},
    helper: false,
    helperContent: "",
    display: "inline",
    canDelete: true,
    popupKey: "",
    value: {
      value: "",
      popups: []
    },
    onChange: _.noop
  };

  constructor(...args) {
    super(...args);

    const {
      value: { value, popups }
    } = this.props;

    this.isLegacyValue = value !== "" && popups.length === 0;
  }

  handleCreate = () => {
    UIState.set("prompt", {
      prompt: "blocks",
      templatesConfig: {}, // this disables the "Pages" tab
      blocksConfig: getBlocksConfig(),
      filterUI: {
        sidebar: false,
        categories: false,
        type: false,
        search: false
      },
      onAddBlocks: this.handleAddBlocks
    });
  };

  handleAddBlocks = blockData => {
    const {
      value: { popups },
      globalBlocks,
      updateGlobalBlock
    } = this.props;
    let popupId;

    if (blockData.type !== "GlobalBlock") {
      popupId = uuid();
      blockData = deepMerge(blockData, {
        value: {
          _blockVisibility: "unlisted",
          popupId
        }
      });
    } else {
      const globalBlockId = blockData.value.globalBlockId;
      const globalBlock = globalBlocks[globalBlockId];

      if (globalBlock.value.popupId) {
        popupId = globalBlock.value.popupId;
      } else {
        // legacy global popups do not have value.popupId so we add it
        popupId = uuid();

        updateGlobalBlock({
          id: globalBlockId,
          data: deepMerge(globalBlock, {
            value: {
              popupId
            }
          }),
          meta: {
            is_autosave: 0
          }
        });
      }
    }

    this.props.onChange({
      value: popupId,
      popups: EditorArrayComponent.insertItem(popups, popups.length, blockData)
    });
  };

  handleEdit = () => {
    const { popupKey } = this.props;

    SectionPopupInstances.get(popupKey).open();

    hideToolbar();

    // Hide Border
    if (currentContainerBorder) {
      currentContainerBorder.setParentsHover(false);
    }
  };

  handleEditLegacy = () => {
    const {
      value: { value }
    } = this.props;

    SectionPopupInstances.get(value).open();

    hideToolbar();

    // Hide Border
    if (currentContainerBorder) {
      currentContainerBorder.setParentsHover(false);
    }
  };

  handleDelete = () => {
    const { value, popups } = this.props.value;

    this.props.onChange({
      value: "",
      popups: popups.filter(item => item.value.popupId !== value)
    });
  };

  renderLabel() {
    const { label, helper, helperContent } = this.props;

    return (
      <div className="brz-ed-option__label">
        {label}
        {helper && (
          <div className="brz-ed-option__helper">
            <EditorIcon icon="nc-alert-circle-que" />
            <div
              className="brz-ed-option__helper__content"
              dangerouslySetInnerHTML={{ __html: helperContent }}
            />
          </div>
        )}
      </div>
    );
  }

  renderThumbnail() {
    const {
      globalBlocks,
      value: { value, popups },
      canDelete
    } = this.props;
    const block = popups.find(block => {
      if (block.type === "GlobalBlock") {
        block = globalBlocks[block.value.globalBlockId];
      }

      return block.value.popupId === value;
    });
    const { url, width, height } = blockThumbnailData(block);
    const { width: wrapperWidth, height: wrapperHeight } = imageWrapperSize(
      width,
      height,
      MAX_CONTAINER_WIDTH
    );
    const style = {
      width: `${wrapperWidth}px`,
      height: `${wrapperHeight}px`
    };

    return (
      <figure
        className="brz-figure brz-ed-option__prompt-popup__image"
        style={style}
      >
        <img
          src={url}
          className="brz-img"
          onClick={this.handleEdit}
          alt="Popup Thumbnail"
        />
        {canDelete && (
          <div
            className="brz-ed-option__prompt-popup-remove"
            onClick={this.handleDelete}
          >
            <EditorIcon icon="nc-circle-remove" />
          </div>
        )}
      </figure>
    );
  }

  renderThumbnailLegacy() {
    const {
      value: { value },
      pageBlocks
    } = this.props;
    let block = pageBlocks.find(block => block.value._id === value);
    const { url, width, height } = blockThumbnailData(block);
    const { width: wrapperWidth, height: wrapperHeight } = imageWrapperSize(
      width,
      height,
      MAX_CONTAINER_WIDTH
    );
    const style = {
      width: `${wrapperWidth}px`,
      height: `${wrapperHeight}px`
    };

    return (
      <figure
        className="brz-figure brz-ed-option__prompt-popup__image"
        style={style}
      >
        <img
          src={url}
          className="brz-img"
          onClick={this.handleEditLegacy}
          alt="Popup Thumbnail"
        />
        {canDelete && (
          <div
            className="brz-ed-option__prompt-popup-remove"
            onClick={this.handleDelete}
          >
            <EditorIcon icon="nc-circle-remove" />
          </div>
        )}
      </figure>
    );
  }

  renderAdder() {
    return (
      <div className="brz-ed-control__focal-point__label">
        <div
          className="brz-ed-control__focal-point__upload"
          onClick={this.handleCreate}
        >
          <EditorIcon icon="nc-add" />
        </div>
      </div>
    );
  }

  render() {
    const {
      className: _className,
      attr,
      label,
      helper,
      display,
      value
    } = this.props;
    const className = classnames(
      "brz-ed-option__prompt-popup",
      `brz-ed-option__${display}`,
      _className,
      attr.className
    );
    let content;

    if (value.value) {
      content = this.isLegacyValue
        ? this.renderThumbnailLegacy()
        : this.renderThumbnail();
    } else {
      content = this.renderAdder();
    }

    return (
      <div {...attr} className={className}>
        {label || helper ? this.renderLabel() : null}
        {content}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pageBlocks: pageBlocksSelector(state),
  globalBlocks: globalBlocksSelector(state)
});
const mapDispatchToProps = {
  updateGlobalBlock
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PromptAddPopupOptionType);
