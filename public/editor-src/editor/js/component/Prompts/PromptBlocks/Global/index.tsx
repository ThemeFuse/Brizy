import React, { Component, ReactElement } from "react";
import { ConnectedProps, connect } from "react-redux";
import Tooltip from "visual/component/Controls/Tooltip";
import { ToastNotification } from "visual/component/Notifications";
import { deleteGlobalBlock, updateGlobalBlock } from "visual/redux/actions2";
import {
  fontsSelector,
  globalBlocksAssembledSelector,
  globalBlocksInPageSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { BlockMetaType } from "visual/types";
import {
  blockThumbnailData,
  createGlobalBlockSymbol
} from "visual/utils/blocks";
import { normalizeFonts } from "visual/utils/fonts";
import { t } from "visual/utils/i18n";
import {
  getBlocksStylesFonts,
  getUsedModelsFonts
} from "visual/utils/traverse";
import { Blocks } from "./Blocks";
import { Info } from "./controls/Info";
import { Props, State, StateToProps, Thumbnail } from "./types";

const mapState = (state: ReduxState): StateToProps => ({
  globalBlocks: globalBlocksAssembledSelector(state),
  globalBlocksInPage: globalBlocksInPageSelector(state),
  projectFonts: fontsSelector(state)
});

const mapDispatch = { updateGlobalBlock, deleteGlobalBlock };

const connector = connect(mapState, mapDispatch);

interface _Props<T extends BlockMetaType>
  extends ConnectedProps<typeof connector>,
    Props<T> {}

class Global<T extends BlockMetaType> extends Component<_Props<T>> {
  state: State = {
    search: ""
  };

  getBlocks(): Array<Thumbnail> {
    const { type, globalBlocks, globalBlocksInPage } = this.props;
    const blocks = Object.values(globalBlocks).filter(
      ({ data, meta = {} }) => !data.deleted && meta.type === type
    );

    return blocks.map((block) => {
      const { url, width, height } = blockThumbnailData({
        type: "",
        value: {},
        meta: block.meta
      });

      const { id, title = t("Untitled"), tags } = block;
      const inactive = type === "normal" && !!globalBlocksInPage[id];

      return {
        uid: id,
        thumbnailSrc: url,
        thumbnailWidth: width,
        thumbnailHeight: height,
        showRemoveIcon: true,
        dataVersion: 1,
        title,
        tags,
        inactive,
        renderWrapper: (content: ReactElement) => {
          return inactive ? this.renderThumbnailTooltip(content) : content;
        }
      };
    });
  }

  handleAdd = async ({ uid }: Thumbnail): Promise<void> => {
    const { globalBlocks, projectFonts, onAddBlocks, onClose } = this.props;
    const block = createGlobalBlockSymbol({ id: uid });
    const fontsDiff = getBlocksStylesFonts(
      getUsedModelsFonts({ models: block, globalBlocks }),
      projectFonts
    );
    const fonts = await normalizeFonts(fontsDiff);

    onAddBlocks({ block, fonts });
    onClose();
  };

  handleRemove = ({ uid }: Thumbnail): void => {
    this.props.deleteGlobalBlock({ id: uid });
  };

  handleUpdate = (thumbnailData: Thumbnail): void => {
    const globalBlock = this.props.globalBlocks[thumbnailData.uid];

    if (globalBlock) {
      this.props.updateGlobalBlock({
        id: globalBlock.id,
        data: globalBlock.data,
        title: thumbnailData.title,
        tags: thumbnailData.tags
      });
    } else {
      ToastNotification.error(t("Error updating global block"));
    }
  };

  renderInfo(): ReactElement {
    return <Info />;
  }

  renderThumbnailTooltip(content: ReactElement): ReactElement {
    return (
      <Tooltip
        className="brz-ed-global-tooltip"
        overlayClassName="brz-ed-tooltip--delay-1"
        size="small"
        offset={5}
        openOnClick={false}
        overlay={this.renderInfo()}
      >
        {content}
      </Tooltip>
    );
  }

  render(): ReactElement {
    const { type, showSearch, showSidebar, HeaderSlotLeft } = this.props;
    const blocks = this.getBlocks();

    return (
      <Blocks
        type={type}
        showSearch={showSearch}
        showSidebar={showSidebar}
        showTitle={true}
        data={blocks}
        HeaderSlotLeft={HeaderSlotLeft}
        onAdd={this.handleAdd}
        onRemove={this.handleRemove}
        onUpdate={this.handleUpdate}
      />
    );
  }
}

export default connector(Global);
