import React, { Component } from "react";
import _ from "underscore";
import { connect } from "react-redux";
import {
  projectSelector,
  fontSelector,
  stylesSelector
} from "visual/redux/selectors";
import { importKit, updateCurrentKitId } from "visual/redux/actions";
import { blockTemplateThumbnailUrl } from "visual/utils/blocks";
import { assetUrl } from "visual/utils/asset";
import {
  getUsedModelsFonts,
  getUsedStylesFonts,
  getBlocksStylesFonts
} from "visual/utils/traverse";
import { t } from "visual/utils/i18n";
import { normalizeFonts } from "visual/utils/fonts";
import Blocks from "./Blocks";

class BlocksContainer extends Component {
  static defaultProps = {
    showSidebar: true,
    showSearch: true,
    showType: true, // dark | light
    showCategories: true,
    type: "kits", // kits | popups
    categoriesFilter: categories => categories,
    HeaderSlotLeft: _.noop(),
    HeaderSlotRight: _.noop(),
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

  async getMeta() {
    const { type } = this.props;
    const r = await fetch(assetUrl(`${type}/meta.json`));
    return await r.json();
  }

  async getBlockResolve(id) {
    const { type } = this.props;
    const r = await fetch(assetUrl(`${type}/resolves/${id}.json`));
    return await r.json();
  }

  getKitData(kits, kitId = this.props.selectedKit) {
    const { categoriesFilter } = this.props;
    const kit = kits.find(({ id }) => id === kitId);
    const { categories, blocks, styles, types } = kit;

    // categories
    const allCategoriesData = categoriesFilter([
      { id: "*", title: t("All Categories") },
      ...categories
    ]);

    // filter blocks
    const categoryIds = new Map(allCategoriesData.map(cat => [cat.id, true]));
    const blocksData = blocks
      .filter(block => block.cat.some(cat => categoryIds.get(cat)))
      .map(block => ({
        ...block,
        thumbnailSrc: blockTemplateThumbnailUrl(block)
      }));
    const categoriesData = allCategoriesData.filter(
      ({ hidden }) => hidden !== true
    );

    return {
      styles,
      types,
      categories: categoriesData,
      blocks: blocksData
    };
  }

  getPopupData({ blocks }) {
    const blocksData = blocks.map(block => ({
      ...block,
      thumbnailSrc: blockTemplateThumbnailUrl(block)
    }));

    return {
      blocks: blocksData
    };
  }

  async componentDidMount() {
    const metaData = await this.getMeta();
    const state =
      this.props.type === "kits"
        ? this.getKitData(metaData)
        : this.getPopupData(metaData);

    this.setState({
      ...state,
      loading: false
    });
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
          styles,
          fonts
        })
      );
    } else {
      dispatch(updateCurrentKitId(kitId));
    }
  };

  render() {
    const { kits, types, blocks, categories, loading } = this.state;

    return (
      <Blocks
        {...this.props}
        loading={loading}
        kits={kits}
        blocks={blocks}
        categories={categories}
        types={types}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlocksContainer);
