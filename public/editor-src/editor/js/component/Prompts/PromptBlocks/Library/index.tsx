import React, { Component, ComponentType } from "react";
import produce from "immer";
import { connect } from "react-redux";
import { match } from "fp-utilities";
import _ from "underscore";
import { ToastNotification } from "visual/component/Notifications";
import {
  authorizedSelector,
  fontSelector,
  extraFontStylesSelector
} from "visual/redux/selectors";
import { FontsPayload } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import {
  SavedBlockMeta,
  SavedLayoutMeta,
  UploadSavedBlocks,
  UploadSavedLayouts
} from "visual/utils/api/types";
import { BlockScreenshots } from "visual/utils/screenshots/types";
import {
  BlockMetaType,
  ExtraFontStyle,
  SavedBlock,
  SavedLayout
} from "visual/types";
import {
  getUsedModelsFonts,
  getBlocksStylesFonts,
  getUsedStylesFonts
} from "visual/utils/traverse";
import { normalizeFonts, normalizeFontStyles } from "visual/utils/fonts";
import {
  getSavedBlocks,
  getSavedBlockById,
  deleteSavedBlock,
  getSavedLayouts,
  getSavedLayoutById,
  deleteSavedLayout,
  uploadSaveBlocks,
  uploadSavePopups,
  uploadSaveLayouts
} from "visual/utils/api";
import { blockThumbnailData } from "visual/utils/blocks";
import { t } from "visual/utils/i18n";
import {
  BlockCategory,
  PromptBlock,
  PromptBlockTemplate,
  BlockTypes
} from "../types";
import Blocks from "./Blocks";
import { getWhiteLabel } from "visual/utils/whiteLabel";
import { IS_WP } from "visual/utils/env";
import { getError, isLayout, isPopup, isBlock } from "../common/utils";
import { ShowSuccessError } from "./Notification";

export type ApiBlockMetaWithType = (SavedLayoutMeta | SavedBlockMeta) & {
  type: BlockTypes;
};

export type BlockThumbs = BlockScreenshots & {
  showRemoveIcon: boolean;
  loading: boolean;
  keywords?: string;
};
export type BlocksThumbs = Array<ApiBlockMetaWithType & BlockThumbs>;

type LibraryProps = {
  type: BlockMetaType;
  showSearch: boolean;
  onAddBlocks: (b: PromptBlock | PromptBlockTemplate) => void;
  onClose: () => void;
  HeaderSlotLeft: ComponentType;
  getParentNode?: () => HTMLElement | null;
};

type LibraryStateProps = {
  projectFonts: ReduxState["fonts"];
  projectExtraFontStyles: ReduxState["extraFontStyles"];
  isAuthorized: boolean;
};

type LibraryState = {
  search: string;
  loading: boolean;
  blocks: BlocksThumbs;
  types: BlockCategory[];
  importLoading: boolean;
  exportLoading: boolean;
};

type GetAssets = {
  fonts: FontsPayload;
  extraFontStyles?: ExtraFontStyle[];
};

const BLOCK: BlockTypes = "BLOCK";
const LAYOUT: BlockTypes = "LAYOUT";
const POPUP: BlockTypes = "POPUP";

const getBlocksType = (type: LibraryProps["type"]): BlockCategory[] => {
  return type === "normal"
    ? [
        { id: BLOCK, title: t("Blocks"), icon: "nc-blocks" },
        { id: LAYOUT, title: t("Layouts"), icon: "nc-pages" }
      ]
    : [{ id: POPUP, title: t("Popups"), icon: "nc-blocks" }];
};

class Library extends Component<
  LibraryProps & LibraryStateProps,
  LibraryState
> {
  static defaultProps: LibraryProps & LibraryStateProps = {
    type: "normal",
    showSearch: true,
    projectFonts: {},
    projectExtraFontStyles: [],
    isAuthorized: false,
    onAddBlocks: _.noop,
    onClose: _.noop,
    HeaderSlotLeft: Component,
    getParentNode: () => null
  };

  state: LibraryState = {
    search: "",
    blocks: [],
    loading: true,
    importLoading: false,
    exportLoading: false,
    types: getBlocksType(this.props.type)
  };

  unMount = false;

  async componentDidMount(): Promise<void> {
    const blocks =
      this.props.type === "normal"
        ? await this.getBlocks()
        : await this.getPopups();

    if (!this.unMount) {
      this.setState({
        blocks,
        loading: false
      });
    }
  }

  componentDidUpdate(nextProps: LibraryProps & LibraryStateProps): void {
    if (nextProps.isAuthorized !== this.props.isAuthorized) {
      this.updateBlocks();
    }
  }

  componentWillUnmount(): void {
    this.unMount = true;
  }

  updateBlocks = async (): Promise<void> => {
    const blocks =
      this.props.type === "normal"
        ? await this.getBlocks()
        : await this.getPopups();

    if (!this.unMount) {
      this.setState({ blocks });
    }
  };

  async getBlocks(): Promise<BlocksThumbs> {
    const savedBlocks = await getSavedBlocks();
    const blocksMeta = savedBlocks.filter(
      ({ meta }) => meta?.type === "normal"
    );
    const layoutsMeta = await getSavedLayouts();
    const blocks = blocksMeta.map(block => ({
      ...this.makeThumbsData(block),
      uid: block.uid,
      type: BLOCK,
      synchronized: block.synchronized || false,
      synchronizable: block.synchronizable || false
    }));
    const layouts = layoutsMeta.map(layout => ({
      ...this.makeThumbsData(layout),
      uid: layout.uid,
      type: LAYOUT,
      synchronized: layout.synchronized || false,
      synchronizable: layout.synchronizable || false
    }));

    return [...blocks, ...layouts];
  }

  async getAssets(
    block: Partial<SavedLayout | SavedBlock>
  ): Promise<GetAssets> {
    const { projectFonts, projectExtraFontStyles } = this.props;
    const { extraFontStyles = [] } = block.meta || {};
    const blockFonts = getUsedModelsFonts({ models: block });
    const stylesFonts = getUsedStylesFonts(extraFontStyles);
    const fonts: FontsPayload = await normalizeFonts(
      getBlocksStylesFonts([...blockFonts, ...stylesFonts], projectFonts)
    );

    const filteredStyles = extraFontStyles.filter(
      ({ id }: { id: string }) => !projectExtraFontStyles.some(p => p.id === id)
    );

    return {
      fonts,
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      extraFontStyles: normalizeFontStyles(filteredStyles)
    };
  }

  async getPopups(): Promise<BlocksThumbs> {
    const savedBlocks = await getSavedBlocks();
    const popupsMeta = savedBlocks.filter(({ meta }) => meta?.type === "popup");

    return popupsMeta.map(popup => ({
      ...this.makeThumbsData(popup),
      uid: popup.uid,
      type: POPUP,
      synchronized: popup.synchronized || false,
      synchronizable: popup.synchronizable || false
    }));
  }

  async handleAddLayout(uid: string): Promise<void> {
    const { onAddBlocks, onClose } = this.props;
    const { data, meta } = await getSavedLayoutById(uid);
    const { fonts, extraFontStyles } = await this.getAssets({ data, meta });

    if (!this.unMount) {
      onAddBlocks({ fonts, extraFontStyles, blocks: data.items });
      onClose();
    }
  }

  async handleAddBlock(uid: string): Promise<void> {
    const { onAddBlocks, onClose } = this.props;
    const { data, meta } = await getSavedBlockById(uid);
    const { fonts, extraFontStyles } = await this.getAssets({ data, meta });

    if (!this.unMount) {
      onAddBlocks({ fonts, extraFontStyles, blocks: [data] });
      onClose();
    }
  }

  async handleAddPopup(uid: string): Promise<void> {
    const { onAddBlocks, onClose } = this.props;
    const { data, meta } = await getSavedBlockById(uid);
    const { fonts, extraFontStyles } = await this.getAssets({ data, meta });

    if (!this.unMount) {
      onAddBlocks({ fonts, extraFontStyles, blocks: [data] });
      onClose();
    }
  }

  handleLoadingBlock(uid: string, loading: boolean): void {
    this.setState(
      produce(state => {
        state.blocks.forEach(
          (block: ApiBlockMetaWithType & BlockThumbs, index: number) => {
            if (block.uid == uid) {
              state.blocks[index].loading = loading;
            }
          }
        );
      })
    );
  }

  handleAddItems = ({ type, uid }: ApiBlockMetaWithType): void => {
    this.handleLoadingBlock(uid, true);

    switch (type) {
      case BLOCK: {
        this.handleAddBlock(uid).catch(() => {
          this.handleLoadingBlock(uid, false);
          const { getParentNode } = this.props;
          const parent = (getParentNode && getParentNode()) || document;
          const doc = parent.ownerDocument?.body;

          ToastNotification.error(
            t("Unable to insert block. Please try again or contact support"),
            { toastContainer: doc }
          );
        });
        break;
      }
      case POPUP: {
        this.handleAddPopup(uid).catch(() => {
          this.handleLoadingBlock(uid, false);
          const { getParentNode } = this.props;
          const parent = (getParentNode && getParentNode()) || document;
          const doc = parent.ownerDocument?.body;

          ToastNotification.error(
            t("Unable to insert popup. Please try again or contact support"),
            { toastContainer: doc }
          );
        });
        break;
      }
      case LAYOUT: {
        this.handleAddLayout(uid).catch(() => {
          this.handleLoadingBlock(uid, false);
          const { getParentNode } = this.props;
          const parent = (getParentNode && getParentNode()) || document;
          const doc = parent.ownerDocument?.body;

          ToastNotification.error(
            t("Unable to insert layout. Please try again or contact support"),
            { toastContainer: doc }
          );
        });
        break;
      }
    }
  };

  handleDeleteItem = ({ type, uid }: ApiBlockMetaWithType): void => {
    switch (type) {
      case BLOCK:
      case POPUP: {
        deleteSavedBlock(uid);
        break;
      }
      case LAYOUT: {
        deleteSavedLayout(uid);
        break;
      }
    }

    this.setState(({ blocks }) => ({
      blocks: blocks.filter(block => block.uid !== uid)
    }));
  };

  handleImport = async (files: FileList, type: BlockTypes): Promise<void> => {
    this.setState({ importLoading: true });
    const fetch = match(
      [isBlock, (): ReturnType<UploadSavedBlocks> => uploadSaveBlocks(files)],
      [isPopup, (): ReturnType<UploadSavedBlocks> => uploadSavePopups(files)],
      [isLayout, (): ReturnType<UploadSavedLayouts> => uploadSaveLayouts(files)]
    );

    try {
      const data = await fetch(type);

      if (data.success.length) {
        await this.updateBlocks();
        ShowSuccessError(data, type);
      }

      if (!this.unMount) {
        this.setState({ importLoading: false });

        data.errors.forEach(({ message }) => {
          ToastNotification.error(message, {
            toastContainer: window.parent.document.body
          });
        });
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.log(e);
      }

      if (!this.unMount) {
        this.setState({ importLoading: false }, () => {
          const message = getError(e);

          ToastNotification.error(message, {
            toastContainer: window.parent.document.body
          });
        });
      }
    }
  };

  makeThumbsData(block: SavedBlockMeta | SavedLayoutMeta): BlockThumbs {
    const { url, width, height } = blockThumbnailData(block);

    return {
      thumbnailSrc: url,
      thumbnailWidth: width,
      thumbnailHeight: height,
      showRemoveIcon: block.isCloudEntity !== true,
      loading: false
    };
  }

  render(): React.ReactElement {
    const {
      loading,
      blocks,
      types,
      search,
      importLoading,
      exportLoading
    } = this.state;
    const { type, HeaderSlotLeft, showSearch } = this.props;
    const hasWhiteLabel = getWhiteLabel();

    return (
      <Blocks
        type={type}
        loading={loading}
        items={blocks}
        types={types}
        showSearch={showSearch}
        sidebarSync={!hasWhiteLabel}
        thumbnailSync={IS_WP}
        thumbnailDownload={IS_WP}
        search={search}
        importLoading={importLoading}
        exportLoading={exportLoading}
        HeaderSlotLeft={HeaderSlotLeft}
        onSuccessSync={this.updateBlocks}
        onChange={this.handleAddItems}
        onDelete={this.handleDeleteItem}
        onImport={IS_WP ? this.handleImport : undefined}
      />
    );
  }
}

const mapStateToProps = (state: ReduxState): LibraryStateProps => ({
  projectFonts: fontSelector(state),
  projectExtraFontStyles: extraFontStylesSelector(state),
  isAuthorized: authorizedSelector(state) === "connected"
});

export default connect(mapStateToProps)(Library);
