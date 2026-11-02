import React, { Component, type ReactElement } from "react";
import { type ConnectedProps, connect } from "react-redux";
import Tooltip from "visual/component/Controls/Tooltip";
import { ToastNotification } from "visual/component/Notifications";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { isPopup, isStory } from "visual/providers/EditorModeProvider";
import {
  deleteGlobalBlock,
  updateError,
  updateGlobalBlockMetaData
} from "visual/redux/actions2";
import {
  fontsSelector,
  globalBlocksAssembledSelector,
  globalBlocksInPageSelector
} from "visual/redux/selectors";
import type { ReduxState } from "visual/redux/types";
import { deleteGlobalBlock as apiDeleteGlobalBlock } from "visual/utils/api";
import {
  blockThumbnailData,
  createGlobalBlockSymbol
} from "visual/utils/blocks";
import { isPro } from "visual/utils/env";
import { ErrorCodes } from "visual/utils/errors";
import { normalizeFonts } from "visual/utils/fonts/normalizeFonts";
import { t } from "visual/utils/i18n";
import {
  getBlocksStylesFonts,
  getUsedModelsFonts
} from "visual/utils/traverse";
import type { PromptBlockMetaType } from "../types";
import { Blocks } from "./Blocks";
import { Info } from "./controls/Info";
import type { Props, State, StateToProps, Thumbnail } from "./types";
import { getRemoveConfirmationMessage } from "./utils";

const mapState = (state: ReduxState): StateToProps => ({
  globalBlocks: globalBlocksAssembledSelector(state),
  getGlobalBlocksInPage: (config: ConfigCommon) =>
    globalBlocksInPageSelector(state, config),
  projectFonts: fontsSelector(state)
});

const mapDispatch = {
  deleteGlobalBlock,
  updateGlobalBlockMetaData,
  updateError
};

const connector = connect(mapState, mapDispatch);

interface _Props<T extends PromptBlockMetaType>
  extends ConnectedProps<typeof connector>,
    Props<T> {}

class Global<T extends PromptBlockMetaType> extends Component<_Props<T>> {
  state: State = {
    search: ""
  };

  getBlocks(): Array<Thumbnail> {
    const { type, globalBlocks, getGlobalBlocksInPage, config } = this.props;
    const globalBlocksInPage = getGlobalBlocksInPage(config);

    const blocks = Object.values(globalBlocks).filter(
      ({ meta = {} }) => meta.type === type
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
      newFonts: fontsDiff
    });

    // @ts-expect-error: is not assignable to type FontPayload<keyof Fonts>
    onAddBlocks({ block, fonts });
    onClose();
  };

  handleRemove = ({ uid }: Thumbnail): void => {
    const { globalBlocks, config, updateError } = this.props;

    const candidate = globalBlocks[uid];
    const messageType = candidate?.rules.length > 0 ? "used" : "unused";

    updateError({
      code: ErrorCodes.REMOVE_GLOBAL_BLOCK,
      data: {
        text: getRemoveConfirmationMessage(messageType),
        handleDelete: ({ onAfterResponse }) => {
          apiDeleteGlobalBlock(uid, config)
            .then(() => {
              onAfterResponse();
              updateError(null);
              this.props.deleteGlobalBlock({ id: uid });
            })
            .catch((err) => {
              onAfterResponse();
              ToastNotification.error(err);
            });
        }
      }
    });
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
