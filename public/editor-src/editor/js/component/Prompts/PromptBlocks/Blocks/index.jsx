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
  defaultKits,
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
  async getMeta(kit) {
    try {
      return this.props.type === "popup"
        ? await defaultPopupsMeta(Config.getAll())
        : await defaultKitsMeta(Config.getAll(), kit);
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Something went wrong on getting meta"));
    }
  }

  async getKits() {
    try {
      return await defaultKits(Config.getAll());
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Something went wrong on getting meta"));
    }
  }

  async getBlockResolve(kit) {
    try {
      return this.props.type === "popup"
        ? await defaultPopupsData(Config.getAll(), kit)
        : await defaultKitsData(Config.getAll(), kit);
    } catch (e) {
      console.error(e);
      ToastNotification.error(
        t("Something went wrong on getting blockResolve data")
      );
    }
  }

  getKitData(kits, allKit) {
    const { categories, blocks, styles, types } = kits;

    // categories
    const allCategoriesData = [
      { id: "*", title: t("All Categories") },
      ...categories
    ];

    const categoriesData = allCategoriesData.filter(
      ({ hidden }) => hidden !== true
    );

    return {
      kits: allKit,
      styles,
      types,
      categories: categoriesData,
      blocks
    };
  }

  addPopupMeta({ thumbnailSrc, thumbnailWidth, thumbnailHeight }) {
    return {
      _thumbnailSrc: thumbnailSrc,
      _thumbnailWidth: thumbnailWidth,
      _thumbnailHeight: thumbnailHeight
    };
  }

  getActiveKit(kits, kitId = this.props.selectedKit) {
    return kits.find(({ id }) => id === kitId);
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

    if (this.props.type === "normal") {
      const kits = await this.getKits();

      const activeKit = this.getActiveKit(kits) ?? kits[0];

      const metaData = await this.getMeta(activeKit);

      if (this.mounted) {
        const state = this.getKitData(metaData, kits);

        this.setState({
          ...state,
          loading: false
        });
      }
    } else {
      const metaData = await this.getMeta();

      if (this.mounted) {
        const state = this.getPopupData(metaData);

        this.setState({
          ...state,
          loading: false
        });
      }
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleThumbnailAdd = async (thumbnailData) => {
    const { projectFonts, onAddBlocks, onClose, type } = this.props;

    const blockData = await this.getBlockResolve(thumbnailData);

    const resolve = {
      ...blockData,
      blockId: thumbnailData.id,
      ...(type === "popup" && { meta: this.addPopupMeta(thumbnailData) })
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

    this.setState({
      loading: true
    });

    const activeKit = kits.find((kit) => kit.id === kitId);

    if (activeKit) {
      const metaData = await this.getMeta(activeKit);
      const newState = this.getKitData(metaData, kits);
      const { styles } = newState;

      this.setState({ ...newState, loading: false });

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
    } else {
      ToastNotification.error(t("Something went wrong!"));
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
