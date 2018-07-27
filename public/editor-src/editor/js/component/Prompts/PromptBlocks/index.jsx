import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import Editor from "visual/global/Editor";
import ScrollPane from "visual/component/ScrollPane";
import Fixed from "visual/component/Prompts/Fixed";
import Select from "visual/component/controls/Select";
import SelectItem from "visual/component/controls/Select/SelectItem";
import SmartGrid from "visual/component/Prompts/common/SmartGrid";
import EditorIcon from "visual/component-new/EditorIcon";
import BlockThumbnail from "./BlockThumbnail";
import { getStore } from "visual/redux/store";
import { updateGlobals } from "visual/redux/actionCreators";
import { t } from "visual/utils/i18n";

const predefinedTypes = [
  {
    id: 200,
    name: "saved",
    title: t("Saved"),
    icon: "nc-save-section",
    getBlocks() {
      const savedBlocks =
        getStore().getState().globals.project.savedBlocks || [];

      return savedBlocks.map(block => {
        const {
          thumbnailWidth,
          thumbnailHeight,
          keywords,
          cat
        } = Editor.getBlock(block.blockId);

        return {
          id: block.blockId,
          thumbnailWidth,
          thumbnailHeight,
          keywords,
          cat,
          type: this.id,
          resolve: block
        };
      });
    },
    removeBlock(block) {
      const store = getStore();
      const savedBlocks = store.getState().globals.project.savedBlocks || [];
      const newValue = _.without(savedBlocks, block.resolve);

      store.dispatch(updateGlobals("savedBlocks", newValue));
    }
  },
  {
    id: 300,
    name: "global",
    title: t("Global"),
    icon: "nc-global",
    getBlocks() {
      const globalBlocks =
        getStore().getState().globals.project.globalBlocks || {};

      const visibleGlobalBlocks = _.omit(
        globalBlocks,
        ({ isHidden }) => isHidden
      );

      return Object.keys(visibleGlobalBlocks).reduce((acc, globalBlockId) => {
        const block = globalBlocks[globalBlockId];

        if (block.deleted) {
          return acc;
        }

        const {
          thumbnailWidth,
          thumbnailHeight,
          keywords,
          cat
        } = Editor.getBlock(block.blockId);

        acc.push({
          id: block.blockId,
          thumbnailWidth,
          thumbnailHeight,
          keywords,
          cat,
          type: this.id,
          resolve: {
            type: "GlobalBlock",
            blockId: block.blockId,
            value: { globalBlockId }
          }
        });

        return acc;
      }, []);
    },
    removeBlock(block) {
      const store = getStore();
      const globalBlocks = store.getState().globals.project.globalBlocks || {};
      const { globalBlockId } = block.resolve.value;
      const newValue = {
        ...globalBlocks,
        [globalBlockId]: {
          ...globalBlocks[globalBlockId],
          deleted: true
        }
      };

      store.dispatch(updateGlobals("globalBlocks", newValue));
    }
  }
];
const predefinedCategories = [
  {
    id: "*",
    name: "all",
    title: t("All Categories")
  }
];

class PromptBlocks extends Component {
  constructor(...args) {
    super(...args);

    this.blocks = Editor.getBlocks();
    this.state = {
      type: this.blocks.types[0],
      category: "*",
      searchQuery: ""
    };
  }

  handleThumbnailClick = blockData => {
    const { id, resolve: _resolve } = blockData;
    const resolve =
      _resolve.blockId !== undefined ? _resolve : { ..._resolve, blockId: id };

    this.props.onAddBlock(resolve);
    this.props.onClose();
  };

  handleCategoryChange = category => {
    this.setState({ category });
  };

  handleTypeChange = type => {
    this.setState({ type });
  };

  handleSearchQueryChange = event => {
    this.setState({
      searchQuery: event.target.value
    });
  };

  getBlocks() {
    const { searchQuery, type, category } = this.state;
    const blocks = type.getBlocks ? type.getBlocks() : this.blocks.blocks;
    const filteredSearchQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "");
    const searchRegex = new RegExp(filteredSearchQuery, "i");

    return blocks.filter(
      block =>
        block.type === type.id &&
        (category === "*" || block.cat.includes(category)) &&
        block.keywords.length &&
        searchRegex.test(block.keywords)
    );
  }

  renderHeader() {
    const { id: currentId } = this.state.type;
    const { onClose } = this.props;
    const { types } = this.blocks;

    const tabs = types.concat(predefinedTypes).map(item => {
      const className = classnames("brz-ed-popup-tab-item", {
        active: item.id === currentId
      });

      return (
        <div
          key={item.id}
          className={className}
          onClick={() => this.handleTypeChange(item)}
        >
          <div className="brz-ed-popup-tab-icon">
            <EditorIcon icon={item.icon} />
          </div>
          <div className="brz-ed-popup-tab-name">{item.title}</div>
        </div>
      );
    });

    return (
      <div className="brz-ed-popup-header">
        <div className="brz-ed-popup-header__tabs">{tabs}</div>
        <div className="brz-ed-popup-btn-close" onClick={onClose} />
      </div>
    );
  }

  renderSearchCategories() {
    const { categories } = this.blocks;
    const categoryOptions = predefinedCategories
      .concat(categories)
      .map(({ id, title }) => (
        <SelectItem key={id} value={id}>
          {title}
        </SelectItem>
      ));

    return (
      <div className="brz-ed-popup__categories">
        <Select
          className="brz-ed-popup__select brz-ed-popup-control__select--light"
          defaultValue={this.state.category}
          maxItems={6}
          itemHeight={30}
          onChange={this.handleCategoryChange}
        >
          {categoryOptions}
        </Select>
      </div>
    );
  }

  renderSearchInput() {
    const { searchQuery } = this.state;
    const searchClassName = classnames("brz-ed-popup__search--icon", {
      active: searchQuery
    });

    return (
      <div className="brz-ed-popup__search">
        <input
          type="text"
          className="brz-input brz-ed-popup__input"
          placeholder={t("Enter Search Keyword")}
          onChange={this.handleSearchQueryChange}
          value={searchQuery}
        />
        <div className={searchClassName}>
          <EditorIcon icon="nc-search" />
        </div>
      </div>
    );
  }

  renderBlocks() {
    const { type } = this.state;
    const blockColumns = this.getBlocks().reduce(
      (acc, block, index) => {
        const props = type.removeBlock
          ? {
              showRemoveIcon: true,
              onRemove: type.removeBlock
            }
          : {};
        const element = (
          <BlockThumbnail
            key={index}
            blockData={block}
            onClick={this.handleThumbnailClick}
            {...props}
          />
        );
        const columnIndex = index % 3;

        acc[columnIndex].push(element);

        return acc;
      },
      [[], [], []]
    );

    return blockColumns.map((el, index) => {
      const key = `${this.state.type.id}-${index}`;
      return (
        <div key={key} className="brz-ed-popup-blocks__grid__column">
          {el}
        </div>
      );
    });
  }

  render() {
    return (
      <Fixed onClose={this.props.onClose}>
        <div className="brz-ed-popup-wrapper brz-ed-popup-blocks">
          {this.renderHeader()}
          <div className="brz-ed-popup-content brz-ed-popup-pane">
            <div className="brz-ed-popup-body">
              <div className="brz-ed-popup__head--search brz-d-xs-flex brz-align-items-center brz-justify-content-xs-center">
                {this.renderSearchCategories()}
                {this.renderSearchInput()}
              </div>
              <div className="brz-ed-popup-blocks-body">
                <ScrollPane
                  style={{ height: 400, overflow: "hidden" }}
                  className="brz-ed-scroll-pane brz-ed-scroll__popup"
                >
                  <div className="brz-ed-popup-blocks__grid">
                    {this.renderBlocks()}
                  </div>
                </ScrollPane>
              </div>
            </div>
          </div>
        </div>
      </Fixed>
    );
  }
}

export default PromptBlocks;
