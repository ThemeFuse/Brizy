import { noop } from "es-toolkit";
import React, { Component } from "react";
import { connect } from "react-redux";
import { ToastNotification } from "visual/component/Notifications";
import { isStory } from "visual/providers/EditorModeProvider";
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
import { isPro } from "visual/utils/env";
import { normalizeFonts } from "visual/utils/fonts/normalizeFonts";
import { normalizeStyles } from "visual/utils/fonts/transform";
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
    showSearch: true,
    showType: true, // dark | light
    showCategories: true,
    type: "normal", // normal | popup
    HeaderSlotLeft: noop,
    onAddBlocks: noop,
    onClose: noop,
    config: {}
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
  async getMeta(kit, api) {
    try {
      return this.props.type === "popup"
        ? await defaultPopupsMeta(api)
        : await defaultKitsMeta(api, kit);
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Something went wrong on getting meta"));
    }
  }

  async getKits(api) {
    try {
      return await defaultKits(api);
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Something went wrong on getting meta"));
    }
  }

  async getBlockResolve(kit, api) {
    try {
      return this.props.type === "popup"
        ? await defaultPopupsData(api, kit)
        : await defaultKitsData(api, kit);
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

  getPopupData({ blocks, categories = [] }) {
    const allCategoriesData = [
      { id: "*", title: t("All Categories") },
      ...categories
    ];

    const blocksData = blocks.map((block) => ({
      ...block,
      pro:
        isExternalPopup(this.props.config) && block.blank === "blank"
          ? false
          : block.pro
    }));
    const categoriesData = allCategoriesData.filter(
      ({ hidden }) => hidden !== true
    );

    return {
      types: [{ title: t("Light"), id: "light", name: "light" }],
      blocks: blocksData,
      categories: categoriesData
    };
  }

  async componentDidMount() {
    this.mounted = true;
    const { type, config } = this.props;

    if (type === "normal") {
      const kits = await this.getKits(config.api);

      const activeKit = this.getActiveKit(kits) ?? kits[0];

      const metaData = await this.getMeta(activeKit, config.api);

      if (this.mounted) {
        const state = this.getKitData(metaData, kits);

        this.setState({
          ...state,
          loading: false
        });
      }
    } else {
      const metaData = await this.getMeta(undefined, config.api);

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
    const { projectFonts, onAddBlocks, onClose, type, config } = this.props;

    const blockData = await this.getBlockResolve(thumbnailData, config.api);

    const resolve = {
      ...blockData,
      blockId: thumbnailData.id,
      ...(type === "popup" && { meta: this.addPopupMeta(thumbnailData) })
    };
    const fontsDiff = getBlocksStylesFonts(
      getUsedModelsFonts({ models: resolve }),
      projectFonts
    );
    const fonts = await normalizeFonts({
      renderContext: "editor",
      newFonts: fontsDiff,
      config
    });

    onAddBlocks({
      block: resolve,
      fonts
    });
    onClose();
  };

  handleImportKit = async (kitId) => {
    const { selectedKit, projectFonts, projectStyles, dispatch, config } =
      this.props;
    const { kits } = this.state;

    if (selectedKit === kitId) {
      return;
    }

    this.setState({
      loading: true
    });

    const activeKit = kits.find((kit) => kit.id === kitId);

    if (activeKit) {
      const metaData = await this.getMeta(activeKit, config.api);
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
        const fonts = await normalizeFonts({
          config,
          renderContext: "editor",
          newFonts: getBlocksStylesFonts(stylesFonts, projectFonts)
        });

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
    const { showSearch, selectedKit, HeaderSlotLeft, config } = this.props;

    const _isStory = isStory(this.props.editorMode);

    const showSidebar =
      loading ||
      types.length > 0 ||
      categories.filter((cat) => cat.id !== "*").length > 0 ||
      kits.length > 1;

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
        isPro={isPro(config)}
        isStory={_isStory}
        upgradeToPro={config.urls.upgradeToPro}
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
