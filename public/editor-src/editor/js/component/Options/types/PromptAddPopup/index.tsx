import deepMerge from "deepmerge";
import React, { Component, HTMLAttributes, ReactNode } from "react";
import { connect, ConnectedProps } from "react-redux";
import { insert } from "timm";
import { OptionLabel } from "visual/component/OptionLabel";
import Prompts, { PromptsProps } from "visual/component/Prompts";
import { PromptBlockTemplate } from "visual/component/Prompts/PromptBlocks/types";
import { hideToolbar } from "visual/component/Toolbar";
import { SectionPopup2Instances } from "visual/editorComponents/SectionPopup2/instances";
import { SectionPopupInstances } from "visual/editorComponents/SectionPopup/instances";
import Config from "visual/global/Config";
import {
  addFonts,
  FontsPayload,
  updateExtraFontStyles,
  updateGlobalBlock
} from "visual/redux/actions2";
import {
  globalBlocksAssembled2Selector,
  pageBlocksSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { Block } from "visual/types";
import { blockThumbnailData } from "visual/utils/blocks";
import { imageWrapperSize } from "visual/utils/image";
import { insertItem } from "visual/utils/models/insertItem";
import { uuid } from "visual/utils/uuid";
import { Adder } from "./Controls/Adder";
import { Main } from "./Controls/Main";
import { Thumbnail } from "./Controls/Thumbail";

const MAX_CONTAINER_WIDTH = 140;

interface Value {
  value?: string;
  // Parent GlobalBlockId
  // when popup is inside a globalBlock
  globalBlockId?: string;
  popups: Block[];
}

interface OwnProps<T extends Value> {
  popupKey: string;
  value: T;
  onChange: <B extends Value>(data: OwnProps<B>["value"]) => void;
  label?: string;
  className?: string;
  attr?: HTMLAttributes<HTMLDivElement>;
  helper?: boolean;
  helperContent?: string;
  canDelete?: boolean;
  display?: "inline" | "block";
}

interface StateProps {
  pageBlocks: Block[];
  globalBlocks: ReduxState["globalBlocks"];
}

const mapState = (state: ReduxState): StateProps => ({
  pageBlocks: pageBlocksSelector(state),
  globalBlocks: globalBlocksAssembled2Selector(state)
});

const mapDispatch = {
  addFonts,
  updateExtraFontStyles,
  updateGlobalBlock
};

const connector = connect(mapState, mapDispatch);

export type Props<T extends Value> = ConnectedProps<typeof connector> &
  OwnProps<T>;

class PromptAddPopupOptionType<T extends Value> extends Component<Props<T>> {
  handleCreate = (): void => {
    const config = Config.getAll();
    const showGlobal = typeof config.api?.globalBlocks?.create === "function";

    const data: PromptsProps<"popup"> = {
      prompt: "blocks",
      mode: "single",
      props: {
        type: "popup",
        showGlobal,
        showTemplate: false,
        blocksType: false,
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
      updateGlobalBlock,
      addFonts
    } = this.props;
    let { block: blockData } = data;
    const { fonts } = data;
    let popupId: string;

    if (fonts?.length) {
      addFonts(fonts);
    }

    let newPopups = [];

    if (blockData.type === "GlobalBlock") {
      const { _id } = blockData.value;
      const globalBlock = globalBlocks[_id].data;

      if (globalBlock.value.popupId) {
        popupId = globalBlock.value.popupId;
      } else {
        // legacy global popups do not have value.popupId so we add it
        popupId = uuid();

        updateGlobalBlock({
          uid: _id,
          data: deepMerge(globalBlock, { value: { popupId } }),
          meta: { is_autosave: 0 }
        });
      }

      newPopups = insert(popups, popups.length, blockData);
    } else {
      popupId = uuid();
      blockData = deepMerge(blockData, {
        value: {
          _blockVisibility: "unlisted",
          popupId
        }
      });

      newPopups = insertItem(popups, popups.length, blockData);
    }

    onChange({
      value: popupId,
      popups: newPopups
    });
  };

  handleAddSavedBlock = (data: PromptBlockTemplate): void => {
    const { fonts, blocks, extraFontStyles = [] } = data;
    const {
      value: { popups },
      addFonts,
      updateExtraFontStyles,
      onChange
    } = this.props;

    const popupId = uuid();
    const blockData = deepMerge(blocks[0], {
      value: {
        _blockVisibility: "unlisted",
        popupId
      }
    });

    if (fonts.length) {
      addFonts(fonts);
    }
    if (extraFontStyles.length) {
      updateExtraFontStyles(extraFontStyles);
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
      popups: popups.filter((item) => {
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
    block = popups.find((block) => {
      if (block.type === "GlobalBlock") {
        block = globalBlocks[block.value._id].data;
      }

      return block.value.popupId === value;
    });

    // try to find in page blocks (legacy)
    if (!block) {
      block = pageBlocks.find((block) => block.value._id === value);
    }

    return block;
  }

  renderLabel(): ReactNode {
    const { label, helper, helperContent } = this.props;
    return label || helper ? (
      <OptionLabel label={label} helper={helper ? helperContent : undefined} />
    ) : null;
  }

  renderThumbnail(block: Block): ReactNode {
    const { canDelete = true } = this.props;
    const { url, width, height } = blockThumbnailData(block, {
      searchScreenshotInStoreFirst: true
    });
    const { width: wrapperWidth, height: wrapperHeight } = imageWrapperSize(
      width,
      height,
      MAX_CONTAINER_WIDTH
    );

    return (
      <Thumbnail
        url={url}
        width={`${wrapperWidth}px`}
        height={`${wrapperHeight}px`}
        onEdit={this.handleEdit}
        onDelete={canDelete ? this.handleDelete : undefined}
      />
    );
  }

  renderAdder(): ReactNode {
    return <Adder onClick={this.handleCreate} />;
  }

  render(): ReactNode {
    const { className, display = "inline", value } = this.props;
    const popupBlock = value.value && this.getPopupBlock();

    return (
      <Main className={className} display={display}>
        {this.renderLabel()}
        {popupBlock ? this.renderThumbnail(popupBlock) : this.renderAdder()}
      </Main>
    );
  }
}

export default connector(PromptAddPopupOptionType);
