import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Editor from "visual/global/Editor";
import UIState from "visual/global/UIState";
import EditorIcon from "visual/component/EditorIcon";
import { hideToolbar } from "visual/component/Toolbar";
import { currentContainerBorder } from "visual/component/ContainerBorder";
import { getStore } from "visual/redux/store";
import { updatePage } from "visual/redux/actions";
import { setIds } from "visual/utils/models";
import { SectionPopupInstances } from "visual/editorComponents/SectionPopup";
import { blockThumbnailData } from "visual/utils/blocks";
import { imageWrapperSize } from "visual/utils/image";

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
    close: true,
    value: "",
    onChange: _.noop
  };

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
    const { value, close } = this.props;
    const blocks = getStore().getState().page.data.items;
    const block = blocks.find(el => el.value._id === value);
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
        {close && (
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

    return (
      <div {...attr} className={className}>
        {label || helper ? this.renderLabel() : null}
        {value ? this.renderThumbnail() : this.renderAdder()}
      </div>
    );
  }
}

export default PromptAddPopupOptionType;
