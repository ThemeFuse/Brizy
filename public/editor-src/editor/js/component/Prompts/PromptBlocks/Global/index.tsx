import React, { Component, ReactElement } from "react";
import { ConnectedProps, connect } from "react-redux";
import Tooltip from "visual/component/Controls/Tooltip";
import { ToastNotification } from "visual/component/Notifications";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { isPopup, isStory } from "visual/providers/EditorModeProvider";
import {
  deleteGlobalBlock,
  updateGlobalBlockMetaData
} from "visual/redux/actions2";
import {
  fontsSelector,
  globalBlocksAssembledSelector,
  globalBlocksInPageSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { BlockMetaType } from "visual/types/GlobalBlock";
import {
  blockThumbnailData,
  createGlobalBlockSymbol
} from "visual/utils/blocks";
import { isPro } from "visual/utils/env";
import { normalizeFonts } from "visual/utils/fonts/normalizeFonts";
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
  getGlobalBlocksInPage: (config: ConfigCommon) =>
    globalBlocksInPageSelector(state, config),
  projectFonts: fontsSelector(state)
});

const mapDispatch = {
  deleteGlobalBlock,
  updateGlobalBlockMetaData
};

const connector = connect(mapState, mapDispatch);

interface _Props<T extends BlockMetaType>
  extends ConnectedProps<typeof connector>,
    Props<T> {}

class Global<T extends BlockMetaType> extends Component<_Props<T>> {
  state: State = {
    search: ""
  };

  getBlocks(): Array<Thumbnail> {
    const { type, globalBlocks, getGlobalBlocksInPage, config } = this.props;
    const globalBlocksInPage = getGlobalBlocksInPage(config);

    const blocks = Object.values(globalBlocks).filter(
      ({ data, meta = {} }) => !data.deleted && meta.type === type
    );
    const { screenshot } = config.urls ?? {};

    return blocks.map((block) => {
      const { url, width, height } = blockThumbnailData({
        block: {
          type: "",
          value: {},
          meta: block.meta
        },
        screenshot,
        config
      });

      const { uid, title = t("Untitled"), tags } = block;
      const inactive = type === "normal" && !!globalBlocksInPage[uid];

      return {
        uid,
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
    const { globalBlocks, projectFonts, onAddBlocks, onClose, config } =
      this.props;
    const block = createGlobalBlockSymbol({ uid });
    const fontsDiff = getBlocksStylesFonts(
      getUsedModelsFonts({ models: block, globalBlocks }),
      projectFonts
    );
    const fonts = await normalizeFonts({
      config: config,
      renderContext: "editor",
      newFonts: fontsDiff
    });

    // @ts-expect-error: is not assignable to type FontPayload<keyof Fonts>
    onAddBlocks({ block, fonts });
    onClose();
  };

  handleRemove = ({ uid }: Thumbnail): void => {
    this.props.deleteGlobalBlock({ id: uid });
  };

  handleUpdate = (thumbnailData: Thumbnail): void => {
    const { globalBlocks } = this.props;

    const globalBlock = globalBlocks[thumbnailData.uid];

    if (globalBlock) {
      this.props.updateGlobalBlockMetaData({
        uid: globalBlock.uid,
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
    const { type, showSearch, showSidebar, HeaderSlotLeft, config } =
      this.props;
    const blocks = this.getBlocks();

    return (
      <Blocks
        type={type}
        showSearch={showSearch}
        showSidebar={showSidebar}
        showTitle={true}
        data={blocks}
        HeaderSlotLeft={HeaderSlotLeft}
        isPopup={isPopup(config.mode)}
        onAdd={this.handleAdd}
        onRemove={this.handleRemove}
        onUpdate={this.handleUpdate}
        isPro={isPro(config)}
        isStory={isStory(config.mode)}
        upgradeToPro={config?.urls?.upgradeToPro}
        config={config}
      />
    );
  }
}

export default connector(Global);
