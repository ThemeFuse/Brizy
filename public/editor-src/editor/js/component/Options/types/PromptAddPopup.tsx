import React from "react";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import _ from "underscore";
import classnames from "classnames";
import deepMerge from "deepmerge";
import { insert } from "timm";
import EditorIcon from "visual/component/EditorIcon";
import Prompts, { PromptsProps } from "visual/component/Prompts";
import { Block } from "visual/types";
import { ReduxState } from "visual/redux/types";
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
  addFonts,
  updateExtraFontStyles,
  ActionUpdateGlobalBlock,
  ActionAddFonts,
  FontsPayload,
  ActionUpdateExtraFontStyles
} from "visual/redux/actions2";

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
    ActionAddFonts | ActionUpdateGlobalBlock | ActionUpdateExtraFontStyles
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
    const data: PromptsProps = {
      prompt: "blocks",
      mode: "single",
      props: {
        type: "popup",
        showTemplate: false,
        blocksType: false,
        globalSearch: false,
        onChangeBlocks: this.handleAddBlocks,
        onChangeGlobal: this.handleAddBlocks,
        onChangeSaved: this.handleAddSavedBlock
      }
    };
    Prompts.open(data);
  };

  handleAddBlocks = (data: { block: Block; fonts: FontsPayload }): void => {
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

    let newPopups = [];
    if (blockData.type !== "GlobalBlock") {
      popupId = uuid();
      blockData = deepMerge(blockData, {
        value: {
          _blockVisibility: "unlisted",
          popupId
        }
      });

      newPopups = insertItem(popups, popups.length, blockData);
    } else {
      const { _id } = blockData.value;
      const globalBlock = globalBlocks[_id].data;

      if (globalBlock.value.popupId) {
        popupId = globalBlock.value.popupId;
      } else {
        // legacy global popups do not have value.popupId so we add it
        popupId = uuid();

        dispatch(
          updateGlobalBlock({
            id: _id,
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

      newPopups = insert(popups, popups.length, blockData);
    }

    onChange({
      value: popupId,
      popups: newPopups
    });
  };

  handleAddSavedBlock = (data: {
    blocks: Block[];
    fonts: FontsPayload;
    extraFontStyles?: Array<{ id: string }>;
  }): void => {
    const { fonts, blocks, extraFontStyles = [] } = data;
    const {
      value: { popups },
      dispatch,
      onChange
    } = this.props;

    const popupId = uuid();
    const blockData = deepMerge(blocks[0], {
      value: {
        _blockVisibility: "unlisted",
        popupId
      }
    });

    if (fonts) {
      dispatch(addFonts(fonts));
    }
    if (extraFontStyles.length) {
      dispatch(updateExtraFontStyles(extraFontStyles));
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
          const { _id } = item.value;
          const globalBlock = globalBlocks[_id].data;

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
        block = globalBlocks[block.value._id].data;
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
