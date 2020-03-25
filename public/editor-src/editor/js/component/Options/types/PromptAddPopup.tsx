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
import { insertItem } from "visual/utils/models/insertItem";
import {
  updateGlobalBlock,
  ActionUpdateGlobalBlock,
  addFonts,
  ActionAddFonts,
  AddFontsPayload
} from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import { ThunkDispatch } from "redux-thunk";
import { Block, SavedBlock, GlobalBlock } from "visual/types";

const MAX_CONTAINER_WIDTH = 140;

type StateProps = {
  pageBlocks: Block[];
  globalBlocks: ReduxState["globalBlocks"];
};
type Value = {
  value: string;
  popups: Block[];
};
type OwnProps = {
  label: string;
  className: string;
  attr: React.HTMLAttributes<HTMLDivElement>;
  helper: boolean;
  helperContent: string;
  display: string;
  canDelete: boolean;
  popupKey: string;
  value: Value;
  onChange: (data: Value) => void;
};
type Props = StateProps & {
  dispatch: ThunkDispatch<
    ReduxState,
    null,
    ActionAddFonts | ActionUpdateGlobalBlock
  >;
} & OwnProps;

class PromptAddPopupOptionType extends React.Component<Props> {
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

  handleCreate = (): void => {
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
          blocksFilter: (
            blocks: [string, SavedBlock][]
          ): [string, SavedBlock][] => {
            return blocks.filter(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ([_, { data: blockData }]) =>
                blockData.type === "SectionPopup" ||
                blockData.type === "SectionPopup2"
            );
          },
          onAddBlocks: this.handleAddBlocks
        },
        global: {
          showSearch: false,
          blocksFilter: (
            blocks: [string, GlobalBlock][]
          ): [string, GlobalBlock][] => {
            return blocks.filter(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ([_, { data: blockData }]) =>
                blockData.type === "SectionPopup" ||
                blockData.type === "SectionPopup2"
            );
          },
          onAddBlocks: this.handleAddBlocks
        }
      }
    });
  };

  handleAddBlocks = (data: { block: Block; fonts: AddFontsPayload }): void => {
    const {
      value: { popups },
      globalBlocks,
      onChange,
      dispatch
    } = this.props;
    let { block: blockData } = data;
    const { fonts } = data;
    let popupId: string;

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
      const globalBlock = globalBlocks[globalBlockId].data;

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
              // eslint-disable-next-line @typescript-eslint/camelcase
              is_autosave: 0
            }
          })
        );
      }
    }

    onChange({
      value: popupId,
      popups: insertItem(popups, popups.length, blockData)
    });
  };

  handleEdit = (): void => {
    const {
      popupKey,
      value: { value }
    } = this.props;

    new Map([...SectionPopupInstances, ...SectionPopup2Instances])
      .get(popupKey || value)
      .open();

    hideToolbar();
  };

  handleDelete = (): void => {
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
          const globalBlock = globalBlocks[globalBlockId].data;

          return globalBlock ? globalBlock.value.popupId !== value : true;
        }
      })
    });
  };

  getPopupBlock(): undefined | Block {
    const {
      globalBlocks,
      pageBlocks,
      value: { value, popups }
    } = this.props;
    let block: undefined | Block;

    // try to find in value.popups (non legacy)
    block = popups.find(block => {
      if (block.type === "GlobalBlock") {
        block = globalBlocks[block.value.globalBlockId].data;
      }

      return block.value.popupId === value;
    });

    // try to find in page blocks (legacy)
    if (!block) {
      block = pageBlocks.find(block => block.value._id === value);
    }

    return block;
  }

  renderLabel(): React.ReactNode {
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

  renderThumbnail(block: Block): React.ReactNode {
    const { canDelete } = this.props;
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

  renderAdder(): React.ReactNode {
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

  render(): React.ReactNode {
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
    const popupBlock = value.value && this.getPopupBlock();

    return (
      <div {...attr} className={className}>
        {label || helper ? this.renderLabel() : null}
        {popupBlock ? this.renderThumbnail(popupBlock) : this.renderAdder()}
      </div>
    );
  }
}

const mapStateToProps = (state: ReduxState): StateProps => ({
  pageBlocks: pageBlocksSelector(state),
  globalBlocks: globalBlocksSelector(state)
});

export default connect<StateProps, {}, OwnProps, ReduxState>(mapStateToProps)(
  PromptAddPopupOptionType
);
