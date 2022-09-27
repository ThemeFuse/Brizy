import { match } from "fp-utilities";
import produce from "immer";
import React, { Component, ComponentType } from "react";
import { connect } from "react-redux";
import _ from "underscore";
import { ToastNotification } from "visual/component/Notifications";
import { currentUserRole } from "visual/component/Roles";
import Config from "visual/global/Config";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { FontsPayload } from "visual/redux/actions2";
import {
  authorizedSelector,
  extraFontStylesSelector,
  fontsSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import {
  BlockMetaType,
  ExtraFontStyle,
  SavedBlock,
  SavedLayout
} from "visual/types";
import { isSavedBlock, isSavedLayout, isSavedPopup } from "visual/types/utils";
import {
  deleteSavedBlock,
  deleteSavedLayout,
  getSavedBlockById,
  getSavedBlocks,
  getSavedLayoutById,
  getSavedLayouts,
  uploadSaveBlocks,
  uploadSaveLayouts,
  uploadSavePopups
} from "visual/utils/api";
import {
  SavedBlockAPI,
  SavedBlockMeta,
  SavedLayoutAPI,
  SavedLayoutMeta,
  UploadSavedBlocks,
  UploadSavedLayouts
} from "visual/utils/api/types";
import { blockThumbnailData } from "visual/utils/blocks";
import { IS_WP } from "visual/utils/env";
import { normalizeFonts, normalizeFontStyles } from "visual/utils/fonts";
import { t } from "visual/utils/i18n";
import { BlockScreenshots } from "visual/utils/screenshots/types";
import {
  getBlocksStylesFonts,
  getUsedModelsFonts,
  getUsedStylesFonts
} from "visual/utils/traverse";
import { getWhiteLabel } from "visual/utils/whiteLabel";
import { getError, isBlock, isLayout, isPopup } from "../common/utils";
import {
  BlockCategory,
  BlockTypes,
  PromptBlock,
  PromptBlockTemplate
} from "../types";
import Blocks from "./Blocks";
import { ShowSuccessError } from "./Notification";

export interface Thumbs extends BlockScreenshots {
  showRemoveIcon: boolean;
  loading: boolean;
  keywords?: string;
}

type LayoutData = Omit<
  SavedLayoutMeta,
  "dataVersion" | "isCloudEntity" | "meta"
>;
type SavedData = Omit<
  SavedLayoutMeta,
  "dataVersion" | "isCloudEntity" | "meta"
>;

interface SavedLayoutWithThumbs extends LayoutData, Thumbs {
  type: "LAYOUT";
}

interface SavedBlockWithThumbs extends SavedData, Thumbs {
  type: "BLOCK" | "POPUP";
}

export type BlockData = SavedLayoutWithThumbs | SavedBlockWithThumbs;

export interface Pagination {
  page: number;
  done: boolean;
}

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
  data: Partial<Record<BlockTypes, BlockData[]>>;
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

// Limitation API for getBlocks
const TOTAL_COUNT = 200;

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
    data: {
      BLOCK: undefined,
      LAYOUT: undefined,
      POPUP: undefined
    },
    loading: true,
    importLoading: false,
    exportLoading: false,
    types: getBlocksType(this.props.type)
  };

  pagination: Partial<Record<BlockTypes, Pagination>> = {
    BLOCK: undefined,
    LAYOUT: undefined,
    POPUP: undefined
  };

  unMount = false;
  withImportExport = true;

  async componentDidMount(): Promise<void> {
    const config = Config.getAll();

    if (isCloud(config)) {
      this.withImportExport = !config.user.isGuest;
    }
    this.updateBlocks(1);
  }

  componentDidUpdate(nextProps: LibraryProps & LibraryStateProps): void {
    if (nextProps.isAuthorized !== this.props.isAuthorized) {
      this.updateBlocks(1);
    }
  }

  componentWillUnmount(): void {
    this.unMount = true;
  }

  updateBlocks = async (page: number): Promise<void> => {
    if (this.props.type === "normal") {
      const BLOCK = await this.getBlocks(page);
      const LAYOUT = await this.getLayout(page);

      if (!this.unMount) {
        this.setState({ data: { BLOCK, LAYOUT }, loading: false }, () => {
          const { BLOCK, LAYOUT } = this.pagination;

          if (BLOCK && !BLOCK.done) {
            this.handleGetMoreBlocks(BLOCK.page + 1, "BLOCK");
          }
          if (LAYOUT && !LAYOUT.done) {
            this.handleGetMoreBlocks(LAYOUT.page + 1, "LAYOUT");
          }
        });
      }
    } else {
      const POPUP = await this.getPopups(page);

      if (!this.unMount) {
        this.setState({ data: { POPUP }, loading: false }, () => {
          const { POPUP } = this.pagination;

          if (POPUP && !POPUP.done) {
            this.handleGetMoreBlocks(POPUP.page + 1, "POPUP");
          }
        });
      }
    }
  };

  async getBlocks(page: number): Promise<BlockData[]> {
    const blocks = await getSavedBlocks({
      page,
      count: TOTAL_COUNT
      // order: "DESC"
    });

    this.pagination.BLOCK = {
      page,
      done: blocks.length < TOTAL_COUNT
    };

    return blocks
      .filter(({ meta }) => meta?.type === "normal")
      .map((block) => ({
        ...this.makeThumbsData(block),
        uid: block.uid,
        type: BLOCK,
        synchronized: block.synchronized || false,
        synchronizable: block.synchronizable || false
      }));
  }

  async getLayout(page: number): Promise<BlockData[]> {
    const layouts = await getSavedLayouts({
      page,
      count: TOTAL_COUNT
      // order: "DESC"
    });

    this.pagination.LAYOUT = {
      page,
      done: layouts.length < TOTAL_COUNT
    };

    return layouts.map((layout) => ({
      ...this.makeThumbsData(layout),
      uid: layout.uid,
      type: LAYOUT,
      synchronized: layout.synchronized || false,
      synchronizable: layout.synchronizable || false
    }));
  }

  async getPopups(page: number): Promise<BlockData[]> {
    const popups = await getSavedBlocks({
      page,
      count: TOTAL_COUNT
      // order: "DESC"
    });

    this.pagination.POPUP = {
      page,
      done: popups.length < TOTAL_COUNT
    };

    return popups
      .filter(({ meta }) => meta?.type === "popup")
      .map((popup) => ({
        ...this.makeThumbsData(popup),
        uid: popup.uid,
        type: POPUP,
        synchronized: popup.synchronized || false,
        synchronizable: popup.synchronizable || false
      }));
  }

  handleGetMoreBlocks = async (
    page: number,
    type: BlockTypes
  ): Promise<void> => {
    const get = match(
      [isBlock, this.getBlocks.bind(this, page)],
      [isPopup, this.getPopups.bind(this, page)],
      [isLayout, this.getLayout.bind(this, page)]
    );

    const data = await get(type);

    this.setState(
      produce((state: LibraryState) => {
        state.data[type]?.push(...data);
        this.pagination[type] = {
          page,
          done: data.length < TOTAL_COUNT
        };
      }),
      (): void => {
        const d = this.pagination[type];

        if (d && !d.done) {
          this.handleGetMoreBlocks(page + 1, type);
        }
      }
    );
  };

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
      ({ id }: { id: string }) =>
        !projectExtraFontStyles.some((p) => p.id === id)
    );

    return {
      fonts,
      // @ts-expect-error: Need to convert normalizeFontStyles to TS
      extraFontStyles: normalizeFontStyles(filteredStyles)
    };
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

  handleLoadingBlock(uid: string, type: BlockTypes, loading: boolean): void {
    this.setState(
      produce((state: LibraryState) => {
        state.data[type] = state.data[type] ?? [];

        //@ts-expect-error: Object is possibly 'undefined'.
        state.data[type].forEach((block, index: number) => {
          if (block.uid == uid) {
            //@ts-expect-error: Object is possibly 'undefined'.
            state.data[type][index].loading = loading;
          }
        });
      })
    );
  }

  handleAddItems = ({ type, uid }: BlockData): void => {
    this.handleLoadingBlock(uid, type, true);

    switch (type) {
      case BLOCK: {
        this.handleAddBlock(uid).catch(() => {
          this.handleLoadingBlock(uid, type, false);
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
          this.handleLoadingBlock(uid, type, false);
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
          this.handleLoadingBlock(uid, type, false);
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

  handleDeleteItem = ({ type, uid }: BlockData): void => {
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

    this.setState(({ data }) => ({
      data: {
        ...data,
        [type]: data[type]?.filter((block) => block.uid !== uid)
      }
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
        const blocks: BlockData[] = [];
        const layouts: BlockData[] = [];
        const popups: BlockData[] = [];

        data.success.forEach((block: SavedBlockAPI | SavedLayoutAPI) => {
          if (isSavedLayout(block)) {
            layouts.push({
              ...this.makeThumbsData(block),
              uid: block.uid,
              type: LAYOUT,
              synchronized: block.synchronized || false,
              synchronizable: block.synchronizable || false
            });
          }
          if (isSavedBlock(block)) {
            blocks.push({
              ...this.makeThumbsData(block),
              uid: block.uid,
              type: BLOCK,
              synchronized: block.synchronized || false,
              synchronizable: block.synchronizable || false
            });
          }
          if (isSavedPopup(block)) {
            popups.push({
              ...this.makeThumbsData(block),
              uid: block.uid,
              type: POPUP,
              synchronized: block.synchronized || false,
              synchronizable: block.synchronizable || false
            });
          }
        });

        this.setState(
          produce((state: LibraryState) => {
            if (blocks.length > 0) {
              state.data.BLOCK = [...(state.data.BLOCK ?? []), ...blocks];
            }
            if (popups.length > 0) {
              state.data.POPUP = [...(state.data.POPUP ?? []), ...popups];
            }
            if (layouts.length > 0) {
              state.data.LAYOUT = [...(state.data.LAYOUT ?? []), ...layouts];
            }
          })
        );

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

  handleSuccessSync = (): void => {
    this.updateBlocks(1);
  };

  makeThumbsData(block: SavedBlockMeta | SavedLayoutMeta): Thumbs {
    const { url, width, height } = blockThumbnailData(block);
    const isAdminRole = currentUserRole() === "admin";

    return {
      thumbnailSrc: url,
      thumbnailWidth: width,
      thumbnailHeight: height,
      showRemoveIcon: block.isCloudEntity !== true && isAdminRole,
      loading: false
    };
  }

  render(): React.ReactElement {
    const { loading, data, types, search, importLoading, exportLoading } =
      this.state;
    const { type, HeaderSlotLeft, showSearch } = this.props;
    const hasWhiteLabel = getWhiteLabel();

    return (
      <Blocks
        type={type}
        loading={loading}
        items={data}
        types={types}
        showSearch={showSearch}
        sidebarSync={!hasWhiteLabel}
        thumbnailSync={IS_WP}
        thumbnailDownload={this.withImportExport}
        search={search}
        importLoading={importLoading}
        exportLoading={exportLoading}
        HeaderSlotLeft={HeaderSlotLeft}
        onSuccessSync={this.handleSuccessSync}
        onChange={this.handleAddItems}
        onDelete={this.handleDeleteItem}
        onImport={this.withImportExport ? this.handleImport : undefined}
      />
    );
  }
}

const mapStateToProps = (state: ReduxState): LibraryStateProps => ({
  projectFonts: fontsSelector(state),
  projectExtraFontStyles: extraFontStylesSelector(state),
  isAuthorized: authorizedSelector(state) === "connected"
});

export default connect(mapStateToProps)(Library);
