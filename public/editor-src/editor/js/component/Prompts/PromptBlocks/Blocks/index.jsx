import React, { Component } from "react";
import _ from "underscore";
import { connect } from "react-redux";
import {
  projectSelector,
  stylesSelector,
  fontSelector
} from "visual/redux/selectors";
import { importKit, updateCurrentKitId } from "visual/redux/actions";
import { blockTemplateThumbnailUrl } from "visual/utils/blocks";
import { IS_EXTERNAL_POPUP } from "visual/utils/models";
import { assetUrl } from "visual/utils/asset";
import {
  getUsedModelsFonts,
  getUsedStylesFonts,
  getBlocksStylesFonts
} from "visual/utils/traverse";
import { t } from "visual/utils/i18n";
import { normalizeFonts, normalizeStyles } from "visual/utils/fonts";
import Blocks from "./Blocks";
import { getBlockDataUrl } from "visual/utils/blocks";

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
    const { type } = this.props;

    if (type === "popup") {
      const r = await fetch(assetUrl("popups/meta.json"));
      return await r.json();
    } else {
      const r = await fetch(assetUrl("kits/meta.json"));
      return await r.json();
    }
  }

  async getBlockResolve(id) {
    const { type } = this.props;

    if (type === "popup") {
      const r = await fetch(getBlockDataUrl("popups", id));
      return await r.json();
    } else {
      const r = await fetch(getBlockDataUrl("kits", id));
      return await r.json();
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

    // filter blocks
    const blocksData = blocks.map(block => ({
      ...block,
      thumbnailSrc: blockTemplateThumbnailUrl(block)
    }));
    const categoriesData = allCategoriesData.filter(
      ({ hidden }) => hidden !== true
    );

    return {
      kits,
      styles,
      types,
      categories: categoriesData,
      blocks: blocksData
    };
  }

  getPopupData({ blocks, categories = [], types = [] }) {
    const allCategoriesData = [
      { id: "*", title: t("All Categories") },
      ...categories
    ];

    const blocksData = blocks.map(block => ({
      ...block,
      pro: IS_EXTERNAL_POPUP && block.blank === "blank" ? false : block.pro,
      thumbnailSrc: blockTemplateThumbnailUrl(block)
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

  handleThumbnailAdd = async thumbnailData => {
    const { projectFonts, onAddBlocks, onClose } = this.props;
    const blockData = await this.getBlockResolve(thumbnailData.id);
    const resolve = { ...blockData, blockId: thumbnailData.id };
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

  handleImportKit = async kitId => {
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

const mapStateToProps = state => ({
  selectedKit: projectSelector(state).data.selectedKit,
  projectFonts: fontSelector(state),
  projectStyles: stylesSelector(state)
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(BlocksContainer);
