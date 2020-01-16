import React from "react";
import { connect } from "react-redux";
import _ from "underscore";
import classnames from "classnames";
import deepMerge from "deepmerge";
import UIState from "visual/global/UIState";
import EditorIcon from "visual/component/EditorIcon";
import { hideToolbar } from "visual/component/Toolbar";
import { SectionPopup2Instances } from "visual/editorComponents/SectionPopup2/instances";
import { SectionPopupInstances } from "visual/editorComponents/SectionPopup/instances";
import { blockThumbnailData } from "visual/utils/blocks";
import { imageWrapperSize } from "visual/utils/image";
import { uuid } from "visual/utils/uuid";
import {
  pageBlocksSelector,
  globalBlocksSelector
} from "visual/redux/selectors";
import { addFonts, updateGlobalBlock } from "visual/redux/actions";
import { insertItem } from "visual/utils/models/insertItem";

const MAX_CONTAINER_WIDTH = 140;

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
      tabs: {
        templates: false // this disables the "Pages" tab
      },
      tabProps: {
        blocks: {
          showSidebar: false,
          showCategories: false,
          showType: false,
          showSearch: false,
          type: "popups",
          onAddBlocks: this.handleAddBlocks
        },
        saved: {
          showSearch: false,
          blocksFilter: blocks => {
            return blocks.filter(
              // eslint-disable-next-line no-unused-vars
              ([_, block]) =>
                block.type === "SectionPopup" || block.type === "SectionPopup2"
            );
          },
          onAddBlocks: this.handleAddBlocks
        },
        global: {
          showSearch: false,
          blocksFilter: blocks => {
            return blocks.filter(
              // eslint-disable-next-line no-unused-vars
              ([_, block]) =>
                block.type === "SectionPopup" || block.type === "SectionPopup2"
            );
          },
          onAddBlocks: this.handleAddBlocks
        }
      }
    });
  };

  handleAddBlocks = data => {
    const {
      value: { popups },
      globalBlocks,
      dispatch
    } = this.props;
    let { block: blockData, fonts } = data;
    let popupId;

    if (fonts) {
      dispatch(addFonts(fonts));
    }

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

        dispatch(
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
          })
        );
      }
    }

    this.props.onChange({
      value: popupId,
      popups: insertItem(popups, popups.length, blockData)
    });
  };

  handleEdit = () => {
    const { popupKey } = this.props;

    new Map([...SectionPopupInstances, ...SectionPopup2Instances])
      .get(popupKey)
      .open();

    hideToolbar();
  };

  handleEditLegacy = () => {
    const {
      value: { value }
    } = this.props;

    new Map([...SectionPopupInstances, ...SectionPopup2Instances])
      .get(value)
      .open();

    hideToolbar();
  };

  handleDelete = () => {
    const {
      value: { value, popups },
      globalBlocks
    } = this.props;

    this.props.onChange({
      value: "",
      popups: popups.filter(item => {
        if (item.type !== "GlobalBlock") {
          return item.value.popupId !== value;
        } else {
          const globalBlockId = item.value.globalBlockId;
          const globalBlock = globalBlocks[globalBlockId];

          return globalBlock ? globalBlock.value.popupId !== value : true;
        }
      })
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
    const { url, width, height } = blockThumbnailData(block, {
      searchScreenshotInStoreFirst: true
    });
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
      pageBlocks,
      canDelete
    } = this.props;
    let block = pageBlocks.find(block => block.value._id === value);
    const { url, width, height } = blockThumbnailData(block, {
      searchScreenshotInStoreFirst: true
    });
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
export default connect(mapStateToProps)(PromptAddPopupOptionType);
