import { match } from "fp-utilities";
import { produce } from "immer";
import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "underscore";
import { ToastNotification } from "visual/component/Notifications";
import { currentUserRole } from "visual/component/Roles";
import Config, { isWp } from "visual/global/Config";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { FontsPayload } from "visual/redux/actions2";
import {
  authorizedSelector,
  extraFontStylesSelector,
  fontsSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { SavedBlock, SavedLayout, isStyle } from "visual/types";
import { isSavedBlock, isSavedLayout, isSavedPopup } from "visual/types/utils";
import {
  deleteSavedBlock,
  deleteSavedLayout,
  deleteSavedPopup,
  getSavedBlockById,
  getSavedBlocks,
  getSavedLayoutById,
  getSavedLayouts,
  getSavedPopupById,
  getSavedPopups,
  importSaveBlocks,
  importSavePopups,
  importSavedLayout,
  updateSavedBlock,
  updateSavedLayout
} from "visual/utils/api";
import { updateSavedPopup } from "visual/utils/api/common";
import { blockThumbnailData } from "visual/utils/blocks";
import { normalizeFontStyles, normalizeFonts } from "visual/utils/fonts";
import { t } from "visual/utils/i18n";
import { read as JSONReader } from "visual/utils/reader/json";
import * as Str from "visual/utils/string/specs";
import {
  getBlocksStylesFonts,
  getUsedModelsFonts,
  getUsedStylesFonts
} from "visual/utils/traverse";
import { getWhiteLabel } from "visual/utils/whiteLabel";
import { isBlock, isLayout, isPopup } from "../common/utils";
import { BlockTypes } from "../types";
import Blocks from "./Blocks";
import { Details } from "./Details";
import { ShowSuccessError } from "./Notification";
import {
  BLOCK,
  BlockData,
  GetAssets,
  LAYOUT,
  LibraryProps,
  LibraryState,
  LibraryStateProps,
  POPUP,
  Pagination,
  SavedBlockAPIMetaWithoutSync,
  SavedLayoutAPIMetaWithoutSync,
  Thumbs,
  isSavedLayoutWithThumbs
} from "./types";
import { getBlocksType } from "./utils/getBlocksType";

class Library extends Component<
  LibraryProps & LibraryStateProps,
  LibraryState
> {
  static defaultProps: LibraryProps & LibraryStateProps = {
    type: "normal",
    showSearch: true,
    showTitle: true,
    projectFonts: {},
    projectExtraFontStyles: [],
    isAuthorized: false,
    onAddBlocks: _.noop,
    onClose: _.noop,
    HeaderSlotLeft: Component,
    getParentNode: () => null
  };

  state: LibraryState = {
    activeType: undefined,
    detailsData: undefined,
    search: "",
    filter: undefined,
    data: {
      BLOCK: undefined,
      LAYOUT: undefined,
      POPUP: undefined
    },
    loading: true,
    importLoading: false,
    exportLoading: false,
    updateLoading: false,
    types: getBlocksType(this.props.type, Config.getAll())
  };

  pagination: Partial<Record<BlockTypes, Pagination>> = {
    BLOCK: undefined,
    LAYOUT: undefined,
    POPUP: undefined
  };

  unMount = false;
  withImportExport = true;

  isWp = isWp(Config.getAll());
  isCloud = isCloud(Config.getAll());

  async componentDidMount(): Promise<void> {
    if (this.isCloud) {
      const config = Config.getAll();
      this.withImportExport = !config.user.isGuest;
    }
    this.updateBlocks();
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
    if (this.state.types.length === 0) {
      return;
    }

    if (this.props.type === "normal") {
      const BLOCK = await this.getBlocks();
      const LAYOUT = await this.getLayout();

      if (!this.unMount) {
        this.setState({ data: { BLOCK, LAYOUT }, loading: false });
      }
    } else {
      const POPUP = await this.getPopups();

      if (!this.unMount) {
        this.setState({ data: { POPUP }, loading: false });
      }
    }
  };

  async getBlocks(filter?: string): Promise<BlockData[]> {
    try {
      const byFilter = filter ? { filterBy: filter } : undefined;
      const blocks = await getSavedBlocks(Config.getAll(), byFilter);

      return blocks.map((block) => ({
        ...this.makeThumbsData(block),
        uid: block.uid,
        type: BLOCK,
        title: block.title,
        tags: block.tags,
        dataVersion: block.dataVersion,
        synchronized: block.synchronized || false,
        synchronizable: block.synchronizable || false
      }));
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Something went wrong on getting blocks."));
      return [];
    }
  }

  async getLayout(filter?: string): Promise<BlockData[]> {
    try {
      const byFilter = filter ? { filterBy: filter } : undefined;
      const blocks = await getSavedLayouts(Config.getAll(), byFilter);

      return blocks.map((block) => ({
        ...this.makeThumbsData(block),
        uid: block.uid,
        type: LAYOUT,
        title: block.title,
        tags: block.tags,
        dataVersion: block.dataVersion,
        globalStyles: block.globalStyles,
        synchronized: block.synchronized || false,
        synchronizable: block.synchronizable || false
      }));
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Something went wrong on getting layouts."));
      return [];
    }
  }

  async getPopups(filter?: string): Promise<BlockData[]> {
    try {
      const byFilter = filter ? { filterBy: filter } : undefined;
      const blocks = await getSavedPopups(Config.getAll(), byFilter);

      return blocks.map((block) => ({
        ...this.makeThumbsData(block),
        uid: block.uid,
        type: POPUP,
        title: block.title,
        tags: block.tags,
        dataVersion: block.dataVersion,
        synchronized: block.synchronized || false,
        synchronizable: block.synchronizable || false
      }));
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Something went wrong on getting popups."));
      return [];
    }
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
      ({ id }: { id: string }) =>
        !projectExtraFontStyles.some((p) => p.id === id)
    );

    return {
      fonts,
      // @ts-expect-error: Need to convert normalizeFontStyles to TS
      extraFontStyles: normalizeFontStyles(filteredStyles)
    };
  }

  async handleAddLayout(uid: string, replaceStyle: boolean): Promise<void> {
    const { onAddBlocks, onClose } = this.props;

    try {
      const { data, meta, globalStyles } = await getSavedLayoutById(
        uid,
        Config.getAll()
      );
      const { fonts, extraFontStyles } = await this.getAssets({ data, meta });

      if (!this.unMount) {
        const readStyle = JSONReader(globalStyles);
        const styles = isStyle(readStyle) ? [readStyle] : undefined;

        onAddBlocks({
          fonts,
          extraFontStyles,
          styles,
          blocks: data.items,
          currentStyleId: replaceStyle && styles ? styles[0].id : undefined
        });
        onClose();
      }
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Failed to get savedLayout"));
    }
  }

  async handleAddBlock(uid: string): Promise<void> {
    const { onAddBlocks, onClose } = this.props;

    try {
      const { data, meta } = await getSavedBlockById(uid, Config.getAll());
      const { fonts, extraFontStyles } = await this.getAssets({ data, meta });

      if (!this.unMount) {
        onAddBlocks({ fonts, extraFontStyles, blocks: [data] });
        onClose();
      }
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Something went wrong"));
    }
  }

  async handleAddPopup(uid: string): Promise<void> {
    const { onAddBlocks, onClose } = this.props;

    try {
      const { data, meta } = await getSavedPopupById(uid, Config.getAll());
      const { fonts, extraFontStyles } = await this.getAssets({ data, meta });

      if (!this.unMount) {
        onAddBlocks({ fonts, extraFontStyles, blocks: [data] });
        onClose();
      }
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Something went wrong"));
    }
  }

  handleLoadingBlock(uid: string, type: BlockTypes, loading: boolean): void {
    this.setState(
      produce((state: LibraryState) => {
        state.data[type] = state.data[type] ?? [];

        state.data[type].forEach((block, index: number) => {
          if (block.uid === uid) {
            //@ts-expect-error: Object is possibly 'undefined'.
            state.data[type][index].loading = loading;
          }
        });
      })
    );
  }

  handleAddItems = (
    { type, uid }: BlockData,
    replaceStyle: boolean | undefined = false
  ): void => {
    this.handleLoadingBlock(uid, type, true);

    switch (type) {
      case BLOCK: {
        this.handleAddBlock(uid).catch(() => {
          this.handleLoadingBlock(uid, type, false);

          ToastNotification.error(
            t("Unable to insert block. Please try again or contact support")
          );
        });
        break;
      }
      case POPUP: {
        this.handleAddPopup(uid).catch(() => {
          this.handleLoadingBlock(uid, type, false);

          ToastNotification.error(
            t("Unable to insert popup. Please try again or contact support")
          );
        });
        break;
      }
      case LAYOUT: {
        this.handleAddLayout(uid, replaceStyle).catch(() => {
          this.handleLoadingBlock(uid, type, false);

          ToastNotification.error(
            t("Unable to insert layout. Please try again or contact support")
          );
        });
        break;
      }
    }
  };

  goToDetails = (thumbnailData: LibraryState["detailsData"]): void => {
    this.setState({ detailsData: thumbnailData });
  };

  handleItemUpdate = async (data: BlockData): Promise<void> => {
    this.setState({ updateLoading: true });
    const { data: rollbackData } = this.state;

    const { type } = data;

    const parsedStyle = isSavedLayoutWithThumbs(data) ? data.globalStyles : {};

    const globalStyles = isStyle(parsedStyle) ? parsedStyle : {};
    const newGlobalStyles = { ...globalStyles, title: data.title };

    const requestData = {
      uid: data.uid,
      title: data.title || "",
      tags: data.tags || "",
      dataVersion: data.dataVersion,
      globalStyles: JSON.stringify(newGlobalStyles)
    };
    const config = Config.getAll();

    const update = match(
      [isBlock, () => updateSavedBlock(requestData, config)],
      [isPopup, () => updateSavedPopup(requestData, config)],
      [isLayout, () => updateSavedLayout(requestData, config)]
    );

    this.setState(
      produce((state: LibraryState) => {
        state.data[type] = state.data[type]?.map((block) => {
          if (block.uid === data.uid) {
            return {
              ...block,
              title: data.title,
              tags: data.tags,
              dataVersion: data.dataVersion
            };
          }
          return block;
        });
      })
    );

    try {
      await update(type);

      if (!this.unMount) {
        this.setState({ updateLoading: false });
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(e);
      }

      if (!this.unMount) {
        this.setState({ updateLoading: false, data: rollbackData }, () => {
          const blockType = type.toLowerCase();

          ToastNotification.error(
            `Unable to update ${blockType}. Please try again or contact support`
          );
        });
      }
    }
  };

  handleDeleteItem = (data: BlockData): void => {
    const { type, uid } = data;

    switch (type) {
      case BLOCK: {
        deleteSavedBlock(data, Config.getAll());
        break;
      }
      case POPUP: {
        deleteSavedPopup(data, Config.getAll());
        break;
      }
      case LAYOUT: {
        deleteSavedLayout(data, Config.getAll());
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

  handleImport = async (type: BlockTypes): Promise<void> => {
    this.setState({ importLoading: true });
    const config = Config.getAll();

    const fetch = match(
      [isBlock, () => importSaveBlocks(config)],
      [isPopup, () => importSavePopups(config)],
      [isLayout, () => importSavedLayout(config)]
    );

    try {
      const data = await fetch(type);

      if (!data) {
        ToastNotification.error(t("Import failed"));
        return;
      }

      if (data.success.length) {
        const blocks: BlockData[] = [];
        const layouts: BlockData[] = [];
        const popups: BlockData[] = [];

        data.success.forEach((_block) => {
          const block = {
            ..._block,
            isCloudEntity: false
          };

          if (isSavedLayout(block)) {
            const gbs = JSONReader(block.globalStyles);

            layouts.push({
              ...this.makeThumbsData(block),
              uid: block.uid,
              type: LAYOUT,
              title: block.title,
              tags: block.tags,
              dataVersion: block.dataVersion,
              synchronized: false,
              synchronizable: false,
              ...(isStyle(gbs) ? { globalStyles: gbs } : {})
            });
          }
          if (isSavedBlock(block)) {
            blocks.push({
              ...this.makeThumbsData(block),
              uid: block.uid,
              type: BLOCK,
              title: block.title,
              tags: block.tags,
              dataVersion: block.dataVersion,
              synchronized: false,
              synchronizable: false
            });
          }
          if (isSavedPopup(block)) {
            popups.push({
              ...this.makeThumbsData(block),
              uid: block.uid,
              type: POPUP,
              title: block.title,
              tags: block.tags,
              dataVersion: block.dataVersion,
              synchronized: false,
              synchronizable: false
            });
          }
        });

        this.setState(
          produce((state: LibraryState) => {
            if (blocks.length > 0) {
              state.data.BLOCK = [...blocks, ...(state.data.BLOCK ?? [])];
            }
            if (popups.length > 0) {
              state.data.POPUP = [...popups, ...(state.data.POPUP ?? [])];
            }
            if (layouts.length > 0) {
              state.data.LAYOUT = [...layouts, ...(state.data.LAYOUT ?? [])];
            }
          })
        );

        ShowSuccessError(data, type);
      }

      if (!this.unMount) {
        this.setState({ importLoading: false });

        data.errors.forEach(({ message }) => {
          ToastNotification.error(message);
        });
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.log(e);
      }

      if (!this.unMount) {
        this.setState({ importLoading: false }, () => {
          const message = Str.read(e) ?? t("Failed to import saved layouts");
          ToastNotification.error(message);
        });
      }
    }
  };

  handleSuccessSync = (): void => {
    this.updateBlocks();
  };

  handleFilterChange = async (
    value: string,
    type: BlockTypes
  ): Promise<void> => {
    switch (type) {
      case BLOCK: {
        try {
          const BLOCK = await this.getBlocks(value);
          if (!this.unMount) {
            this.setState(
              produce((state: LibraryState) => {
                state.data.BLOCK = BLOCK;
              })
            );
          }
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.error(e);
          }
          ToastNotification.error(t("Unable to fetch blocks by filter"));
        }
        break;
      }
      case LAYOUT: {
        try {
          const LAYOUT = await this.getLayout(value);
          if (!this.unMount) {
            this.setState(
              produce((state: LibraryState) => {
                state.data.LAYOUT = LAYOUT;
              })
            );
          }
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.error(e);
          }
          ToastNotification.error(t("Unable to fetch layouts by filter"));
        }
        break;
      }
      case POPUP: {
        try {
          const POPUP = await this.getPopups(value);
          if (!this.unMount) {
            this.setState(
              produce((state: LibraryState) => {
                state.data.POPUP = POPUP;
              })
            );
          }
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.error(e);
          }
          ToastNotification.error(t("Unable to fetch popups by filter"));
        }
        break;
      }
    }
  };

  makeThumbsData(
    block: SavedBlockAPIMetaWithoutSync | SavedLayoutAPIMetaWithoutSync
  ): Thumbs {
    const { url, width, height } = blockThumbnailData({
      type: "",
      value: {},
      meta: block.meta
    });
    const isAdminRole = currentUserRole() === "admin";

    return {
      thumbnailSrc: url,
      thumbnailWidth: width,
      thumbnailHeight: height,
      showRemoveIcon: !block.isCloudEntity && isAdminRole,
      loading: false
    };
  }

  handleDetailsBack = () => {
    this.setState((stt) => ({
      detailsData: undefined,
      activeType: stt.types.find((item) => item.id === stt.detailsData?.type)
    }));
  };

  changeHandler = (b: BlockData) =>
    isSavedLayoutWithThumbs(b) ? this.goToDetails(b) : this.handleAddItems(b);

  render(): React.ReactElement {
    const {
      detailsData,
      loading,
      data,
      types,
      search,
      importLoading,
      exportLoading,
      activeType,
      filter
    } = this.state;
    const { type, HeaderSlotLeft, showSearch, showTitle, onClose } = this.props;
    const hasWhiteLabel = getWhiteLabel();

    if (detailsData && isSavedLayoutWithThumbs(detailsData)) {
      return (
        <Details
          data={detailsData}
          onAddBlocks={this.handleAddItems}
          onBack={this.handleDetailsBack}
          onClose={onClose}
        />
      );
    }

    return (
      <Blocks
        activeType={activeType}
        type={type}
        loading={loading}
        items={data}
        types={types}
        showSearch={showSearch}
        showTitle={showTitle}
        sidebarSync={!hasWhiteLabel}
        thumbnailSync={this.isWp}
        thumbnailDownload={this.withImportExport}
        search={search}
        filter={filter}
        importLoading={importLoading}
        exportLoading={exportLoading}
        HeaderSlotLeft={HeaderSlotLeft}
        onSuccessSync={this.handleSuccessSync}
        onChange={this.changeHandler}
        onDelete={this.handleDeleteItem}
        onImport={this.withImportExport ? this.handleImport : undefined}
        onUpdate={this.handleItemUpdate}
        onFilterChange={this.handleFilterChange}
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
