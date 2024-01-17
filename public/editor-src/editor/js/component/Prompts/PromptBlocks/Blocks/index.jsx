import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "underscore";
import { ToastNotification } from "visual/component/Notifications";
import Config from "visual/global/Config";
import { importKit, updateCurrentKitId } from "visual/redux/actions2";
import {
  fontsSelector,
  projectSelector,
  stylesSelector
} from "visual/redux/selectors";
import {
  defaultKitsData,
  defaultKitsMeta,
  defaultPopupsData,
  defaultPopupsMeta
} from "visual/utils/api";
import { normalizeFonts, normalizeStyles } from "visual/utils/fonts";
import { t } from "visual/utils/i18n";
import { isExternalPopup } from "visual/utils/models";
import {
  getBlocksStylesFonts,
  getUsedModelsFonts,
  getUsedStylesFonts
} from "visual/utils/traverse";
import Blocks from "./Blocks";

class BlocksContainer extends Component {
  static defaultProps = {
    showSidebar: true,
    showSearch: true,
    showType: true, // dark | light
    showCategories: true,
    type: "normal", // normal | popup
    HeaderSlotLeft: _.noop(),
    onAddBlocks: _.noop,
    onClose: _.noop
  };

  state = {
    kits: [],
    loading: true,
    styles: [],
    types: [],
    categories: [],
    blocks: []
  };

  mounted = false;
  async getMeta() {
    try {
      return this.props.type === "popup"
        ? await defaultPopupsMeta(Config.getAll())
        : await defaultKitsMeta(Config.getAll());
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Something went wrong on getting meta"));
    }
  }

  async getBlockResolve(id) {
    try {
      return this.props.type === "popup"
        ? await defaultPopupsData(Config.getAll(), id)
        : await defaultKitsData(Config.getAll(), id);
    } catch (e) {
      console.error(e);
      ToastNotification.error(
        t("Something went wrong on getting blockResolve data")
      );
    }
  }

  getKitData(kits, kitId = this.props.selectedKit) {
    const kit = kits.find(({ id }) => id === kitId);
    const { categories, blocks, styles, types } = kit;

    // categories
    const allCategoriesData = [
      { id: "*", title: t("All Categories") },
      ...categories
    ];

    const categoriesData = allCategoriesData.filter(
      ({ hidden }) => hidden !== true
    );

    return {
      kits,
      styles,
      types,
      categories: categoriesData,
      blocks
    };
  }

  addThumbData({ thumbnailSrc, thumbnailWidth, thumbnailHeight }) {
    return {
      _thumbnailSrc: thumbnailSrc,
      _thumbnailWidth: thumbnailWidth,
      _thumbnailHeight: thumbnailHeight
    };
  }

  getPopupData({ blocks, categories = [], types = [] }) {
    const allCategoriesData = [
      { id: "*", title: t("All Categories") },
      ...categories
    ];

    const blocksData = blocks.map((block) => ({
      ...block,
      pro:
        isExternalPopup(Config.getAll()) && block.blank === "blank"
          ? false
          : block.pro
    }));
    const categoriesData = allCategoriesData.filter(
      ({ hidden }) => hidden !== true
    );

    return {
      types,
      blocks: blocksData,
      categories: categoriesData
    };
  }

  async componentDidMount() {
    this.mounted = true;
    const metaData = await this.getMeta();

    if (this.mounted) {
      const state =
        this.props.type === "normal"
          ? this.getKitData(metaData)
          : this.getPopupData(metaData);

      this.setState({
        ...state,
        loading: false
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleThumbnailAdd = async (thumbnailData) => {
    const { projectFonts, onAddBlocks, onClose } = this.props;
    const blockData = await this.getBlockResolve(thumbnailData.id);

    const resolve = {
      ...blockData,
      blockId: thumbnailData.id,
      meta: this.addThumbData(thumbnailData)
    };
    const fontsDiff = getBlocksStylesFonts(
      getUsedModelsFonts({ models: resolve }),
      projectFonts
    );
    const fonts = await normalizeFonts(fontsDiff);

    onAddBlocks({
      block: resolve,
      fonts
    });
    onClose();
  };

  handleImportKit = async (kitId) => {
    const { selectedKit, projectFonts, projectStyles, dispatch } = this.props;
    const { kits } = this.state;

    if (selectedKit === kitId) {
      return;
    }

    const newState = this.getKitData(kits, kitId);
    const { styles } = newState;

    this.setState(newState);

    if (
      styles.some(
        ({ id }) => !projectStyles.some(({ id: stId }) => stId === id)
      )
    ) {
      const stylesFonts = styles.reduce(
        (acc, { fontStyles }) => acc.concat(getUsedStylesFonts(fontStyles)),
        []
      );
      const fonts = await normalizeFonts(
        getBlocksStylesFonts(stylesFonts, projectFonts)
      );

      dispatch(
        importKit({
          selectedKit: kitId,
          // TEMP. Check styles reducers and change this condition
          styles: styles ? normalizeStyles(styles) : undefined,
          fonts
        })
      );
    } else {
      dispatch(updateCurrentKitId(kitId));
    }
  };

  render() {
    const { kits, types, blocks, categories, loading } = this.state;
    const { showSearch, showSidebar, selectedKit, HeaderSlotLeft } = this.props;

    return (
      <Blocks
        loading={loading}
        selectedKit={selectedKit}
        kits={kits}
        blocks={blocks}
        categories={categories}
        types={types}
        showSearch={showSearch}
        showSidebar={showSidebar}
        HeaderSlotLeft={HeaderSlotLeft}
        onChangeKit={this.handleImportKit}
        onChange={this.handleThumbnailAdd}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  selectedKit: projectSelector(state).data.selectedKit,
  projectFonts: fontsSelector(state),
  projectStyles: stylesSelector(state)
});
const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(BlocksContainer);
