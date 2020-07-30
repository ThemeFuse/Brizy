import React, { Component, Fragment } from "react";
import _ from "underscore";
import Scrollbars from "react-custom-scrollbars";
import EditorIcon from "visual/component/EditorIcon";
import DataFilter from "../common/DataFilter";
import Sidebar, { SidebarList, SidebarOption } from "../common/Sidebar";
import SearchInput from "../common/SearchInput";
import ThumbnailGrid from "../common/ThumbnailGrid";
import { LayoutThumbnail } from "../common/Thumbnail";
import { templateThumbnailUrl } from "visual/utils/templates";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";
import Details from "./Details";

export default class List extends Component {
  static defaultProps = {
    showSidebar: true,
    showSearch: true,
    onAddBlocks: _.noop,
    onClose: _.noop,
    onNext: _.noop
  };

  state = {
    data: null,
    thumbnailData: null
  };

  async componentDidMount() {
    const data = await this.getData();

    this.setState({
      data
    });
  }

  async getData() {
    const url = assetUrl("templates/meta.json");
    const data = await fetch(url);

    return await data.json();
  }

  handleThumbnailAdd = thumbnailData => {
    this.setState({ thumbnailData });
  };

  renderLoading() {
    const { showSidebar, showSearch, HeaderSlotLeft } = this.props;

    return (
      <Fragment>
        {showSearch && (
          <HeaderSlotLeft>
            <SearchInput className="brz-ed-popup-two-header__search" />
          </HeaderSlotLeft>
        )}
        {showSidebar && (
          <div className="brz-ed-popup-two-body__sidebar">
            <div className="brz-ed-popup-two-sidebar-body" />
          </div>
        )}
        <div className="brz-ed-popup-two-body__content brz-ed-popup-two-body__content--loading">
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        </div>
      </Fragment>
    );
  }

  renderList() {
    const { data } = this.state;
    const { showSidebar, showSearch, HeaderSlotLeft } = this.props;
    const { templates } = data;
    const thumbnails = templates.map(el => ({
      ...el,
      ...el.pages[0],
      thumbnailSrc: templateThumbnailUrl(el.pages[0])
    }));
    const filterFn = (item, cf) => {
      const categoryMatch =
        cf.category === "*" || item.cat.includes(Number(cf.category));
      const searchMatch =
        cf.search === "" ||
        new RegExp(cf.search.replace(/[.*+?^${}()|[\]\\]/g, ""), "i").test(
          item.keywords
        );

      return categoryMatch && searchMatch;
    };
    const defaultFilter = {
      category: "*",
      search: ""
    };
    const blocksArr = templates;
    const countersSectionBlocks = {};

    for (let i = 0; i < blocksArr.length; i++) {
      const sectionCat = blocksArr[i].cat;

      for (let j = 0; j < sectionCat.length; j++) {
        const sectionCatPro = sectionCat[j];
        countersSectionBlocks["*"] = blocksArr.length;

        if (countersSectionBlocks[sectionCatPro] === undefined) {
          countersSectionBlocks[sectionCatPro] = 1;
        } else {
          countersSectionBlocks[sectionCatPro]++;
        }
      }
    }
    const categories = [
      {
        id: "*",
        title: t("All Categories")
      }
    ].concat(data.categories);

    return (
      <DataFilter
        data={thumbnails}
        filterFn={filterFn}
        defaultFilter={defaultFilter}
      >
        {(filteredThumbnails, currentFilter, setFilter) => (
          <Fragment>
            {showSearch && (
              <HeaderSlotLeft>
                <SearchInput
                  className="brz-ed-popup-two-header__search"
                  value={currentFilter.search}
                  onChange={value => setFilter({ search: value })}
                />
              </HeaderSlotLeft>
            )}

            {showSidebar && (
              <Sidebar>
                <SidebarOption title="CATEGORIES">
                  <SidebarList
                    lists={categories}
                    value={currentFilter.category}
                    counters={countersSectionBlocks}
                    onChange={value => setFilter({ category: value })}
                  />
                </SidebarOption>
              </Sidebar>
            )}

            <div className="brz-ed-popup-two-body__content brz-ed-popup-two-blocks-body-layouts">
              <Scrollbars>
                {filteredThumbnails.length > 0 ? (
                  <ThumbnailGrid
                    data={filteredThumbnails}
                    ThumbnailComponent={LayoutThumbnail}
                    onThumbnailAdd={this.handleThumbnailAdd}
                    onThumbnailRemove={this.handleThumbnailRemove}
                  />
                ) : (
                  <div className="brz-ed-popup-two-blocks__grid brz-ed-popup-two-blocks__grid-clear">
                    <p className="brz-ed-popup-two-blocks__grid-clear-text">
                      {t("Nothing here, please refine your search.")}
                    </p>
                  </div>
                )}
              </Scrollbars>
            </div>
          </Fragment>
        )}
      </DataFilter>
    );
  }

  renderDetails() {
    return (
      <Details
        {...this.props}
        data={this.state.thumbnailData}
        onBack={() => {
          this.setState({ thumbnailData: null });
        }}
      />
    );
  }

  render() {
    const { data, thumbnailData } = this.state;

    if (!data) {
      return this.renderLoading();
    }

    if (thumbnailData) {
      return this.renderDetails();
    }

    return this.renderList();
  }
}
