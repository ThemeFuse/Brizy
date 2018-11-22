import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Editor from "visual/global/Editor";
import UIState from "visual/global/UIState";
import EditorIcon from "visual/component/EditorIcon";
import { hideToolbar } from "visual/component/Toolbar";
import { currentContainerBorder } from "visual/component/ContainerBorder";
import { getStore } from "visual/redux/store";
import { updatePage } from "visual/redux/actionCreators";
import { setIds } from "visual/utils/models";
import { SectionPopupInstances } from "visual/editorComponents/SectionPopup";
import { blockThumbnailUrl } from "visual/utils/blocks";
import { imageWrapperSize } from "visual/utils/image";

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
    blocks
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
    value: "",
    onChange: _.noop
  };

  handleCreate = () => {
    UIState.set("prompt", {
      prompt: "blocks",
      templatesConfig: {}, // this disables the "Pages" tab
      blocksConfig: getBlocksConfig(),
      filterUI: {
        categories: false,
        type: false
      },
      onAddBlocks: this.handleAddBlocks
    });
  };

  handleAddBlocks = blockData => {
    const blockDataWithIds = setIds(blockData);
    blockDataWithIds.value._blockVisibility = "unlisted";

    const store = getStore();
    const pageData = store.getState().page.data;
    const pageItems = pageData.items || [];

    store.dispatch(
      updatePage({
        data: {
          ...pageData,
          items: [...pageItems, blockDataWithIds]
        }
      })
    );

    setTimeout(() => {
      this.props.onChange(blockDataWithIds.value._id);
    }, 0);
  };

  handleEdit = () => {
    const { value } = this.props;
    const popupByInstance = SectionPopupInstances.get(value);

    popupByInstance.open();

    hideToolbar();

    // Hide Border
    if (currentContainerBorder) {
      currentContainerBorder.setParentsHover(false);
    }
  };

  handleDelete = () => {
    const store = getStore();
    const pageData = store.getState().page.data;
    const pageItems = pageData.items || [];
    const pageItemsWithoutPopup = pageItems.filter(
      item => item.value._id !== this.props.value
    );

    store.dispatch(
      updatePage({
        data: {
          ...pageData,
          items: pageItemsWithoutPopup
        }
      })
    );

    setTimeout(() => {
      this.props.onChange("");
    }, 0);
  };

  renderLabel() {
    const { label, helper, helperContent } = this.props;

    return (
      <div className="brz-ed-option__label">
        {label}
        {helper && (
          <div className="brz-ed-option__helper">
            <EditorIcon icon="nc-alert-circle-que" />
            <div className="brz-ed-option__helper__content">
              {helperContent}
            </div>
          </div>
        )}
      </div>
    );
  }

  renderThumbnail() {
    const { value } = this.props;
    const blocks = getStore().getState().page.data.items;
    const { blockId } = blocks.find(el => el.value._id === value);
    const blockData = Editor.getBlock(blockId);
    const MAX_CONTAINER_WIDTH = 140;
    const { width, height } = imageWrapperSize(
      blockData.thumbnailWidth,
      blockData.thumbnailHeight,
      MAX_CONTAINER_WIDTH
    );

    return (
      <figure
        className="brz-figure brz-ed-option__prompt-popup__image"
        style={{
          width: `${width}px`,
          height: `${height}px`
        }}
      >
        <img
          src={blockThumbnailUrl(blockData)}
          className="brz-img"
          onClick={this.handleEdit}
          alt="Popup Thumbnail"
        />
        <div
          className="brz-ed-option__prompt-popup-remove"
          onClick={this.handleDelete}
        >
          <EditorIcon icon="nc-circle-remove" />
        </div>
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

    return (
      <div {...attr} className={className}>
        {label || helper ? this.renderLabel() : null}
        {value ? this.renderThumbnail() : this.renderAdder()}
      </div>
    );
  }
}

export default PromptAddPopupOptionType;
