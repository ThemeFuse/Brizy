import React, {
  Component,
  ComponentType,
  ReactElement,
  ReactNode
} from "react";
import _ from "underscore";
import Scrollbars from "react-custom-scrollbars";
import { Block } from "visual/types";
import EditorIcon from "visual/component/EditorIcon";
import DataFilter from "../common/DataFilter";
import Sidebar, { SidebarList, SidebarOption } from "../common/Sidebar";
import SearchInput from "../common/SearchInput";
import ThumbnailGrid, {
  ThumbnailProps,
  Data as ThumbnailData
} from "../common/ThumbnailGrid";
import Thumbnail, { LayoutThumbnail } from "../common/Thumbnail";
import { templateThumbnailUrl } from "visual/utils/templates";
import { assetUrl } from "visual/utils/asset";
import { t } from "visual/utils/i18n";
import Details from "./Details";
import { getBlockDataUrl } from "visual/utils/blocks";
import { PromptBlockTemplate } from "../types";
import {
  isStoryData,
  Page,
  LayoutData,
  StoriesData,
  TemplatesData,
  Filter,
  Category
} from "./types";

interface Data extends ThumbnailData, LayoutData {}

export interface Props {
  type: "stories" | "templates";
  showSidebar: boolean;
  showSearch: boolean;
  HeaderSlotLeft?: ComponentType;
  onAddBlocks: (b: PromptBlockTemplate) => void;
  onClose: VoidFunction;
  onNext: VoidFunction;
}

interface State {
  data: undefined | StoriesData | TemplatesData;
  detailsData: undefined | LayoutData;
}

const defaultFilter: Filter = {
  category: "*",
  search: ""
};

export default class List extends Component<Props, State> {
  static defaultProps: Props = {
    type: "templates",
    showSidebar: true,
    showSearch: true,
    onAddBlocks: _.noop,
    onClose: _.noop,
    onNext: _.noop
  };

  state: State = {
    data: undefined,
    detailsData: undefined
  };

  async componentDidMount(): Promise<void> {
    const data = await this.getData();

    this.setState({ data });
  }

  async getData(): Promise<StoriesData | TemplatesData> {
    const url = assetUrl(`${this.props.type}/meta.json`);
    const data = await fetch(url);

    return await data.json();
  }

  filterFn = (item: LayoutData, cf: Filter): boolean => {
    const searchRegex = new RegExp(
      cf.search?.replace(/[.*+?^${}()|[\]\\]/g, ""),
      "i"
    );

    const categoryMatch =
      cf.category === "*" || item.cat.includes(Number(cf.category));
    const searchMatch =
      cf.search === "" ||
      searchRegex.test(item.keywords) ||
      searchRegex.test(item.name);

    return categoryMatch && searchMatch;
  };

  getLayoutData(data: StoriesData | TemplatesData): LayoutData[] {
    if (isStoryData(data)) {
      return data.stories;
    } else {
      return data.templates;
    }
  }

  handleThumbnailAdd = (thumbnailData: State["detailsData"]): void => {
    this.setState({ detailsData: thumbnailData });
  };

  async getBlockResolve(id: string): Promise<Block> {
    const url = getBlockDataUrl(this.props.type, id);
    const r = await fetch(url);
    return await r.json();
  }

  handleBlankThumbnailAdd = async (data: Page): Promise<void> => {
    const { onAddBlocks, onClose } = this.props;
    const blockData = await this.getBlockResolve(data.id);
    const resolve = { ...blockData, blockId: data.id };

    onAddBlocks({
      blocks: [resolve],
      fonts: []
    });
    onClose();
  };

  renderSlotLeft(children: ReactNode): ReactNode {
    const { HeaderSlotLeft } = this.props;

    if (HeaderSlotLeft) {
      return <HeaderSlotLeft>{children}</HeaderSlotLeft>;
    }

    return children;
  }

  renderLoading(): ReactElement {
    const { showSidebar, showSearch } = this.props;

    return (
      <>
        {showSearch &&
          this.renderSlotLeft(
            <SearchInput className="brz-ed-popup-two-header__search" />
          )}
        {showSidebar && (
          <div className="brz-ed-popup-two-body__sidebar">
            <div className="brz-ed-popup-two-sidebar-body" />
          </div>
        )}
        <div className="brz-ed-popup-two-body__content brz-ed-popup-two-body__content--loading">
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        </div>
      </>
    );
  }

  renderThumbnail = ({
    data,
    ...props
  }: ThumbnailProps<Data>): ReactElement => {
    const { type } = this.props;

    if (type === "stories" && data.blank) {
      return (
        <Thumbnail
          {...props}
          data={data.pages[0]}
          onAdd={this.handleBlankThumbnailAdd}
        />
      );
    }

    return <LayoutThumbnail data={data} {...props} />;
  };

  renderList(data: StoriesData | TemplatesData): ReactElement {
    const { showSidebar, showSearch } = this.props;
    const blocks = this.getLayoutData(data);
    const thumbnails = blocks.map(el => ({
      ...el,
      ...el.pages[0],
      thumbnailSrc: templateThumbnailUrl(el.pages[0])
    }));

    const countersSectionBlocks: { [k: string]: number } = {};

    for (let i = 0; i < blocks.length; i++) {
      const sectionCat = blocks[i].cat;

      for (let j = 0; j < sectionCat.length; j++) {
        const sectionCatPro = sectionCat[j];
        countersSectionBlocks["*"] = blocks.length;

        if (countersSectionBlocks[sectionCatPro] === undefined) {
          countersSectionBlocks[sectionCatPro] = 1;
        } else {
          countersSectionBlocks[sectionCatPro]++;
        }
      }
    }
    const categories = ([
      {
        id: "*",
        title: t("All Categories")
      }
    ] as Category[])
      .concat(data.categories)
      .filter(({ hidden }) => hidden !== true);

    return (
      <DataFilter<Data, Filter>
        data={thumbnails}
        filterFn={this.filterFn}
        defaultFilter={defaultFilter}
      >
        {(filteredThumbnails, currentFilter, setFilter): ReactElement => (
          <>
            {showSearch &&
              this.renderSlotLeft(
                <SearchInput
                  className="brz-ed-popup-two-header__search"
                  value={currentFilter.search}
                  onChange={(value: string): void =>
                    setFilter({ search: value })
                  }
                />
              )}

            {showSidebar && (
              <Sidebar>
                <SidebarOption title="CATEGORIES">
                  <SidebarList
                    lists={categories}
                    value={currentFilter.category}
                    counters={countersSectionBlocks}
                    onChange={(value: string): void =>
                      setFilter({ category: value })
                    }
                  />
                </SidebarOption>
              </Sidebar>
            )}

            <div className="brz-ed-popup-two-body__content brz-ed-popup-two-blocks-body-layouts">
              <Scrollbars>
                {filteredThumbnails.length > 0 ? (
                  <ThumbnailGrid<Data>
                    data={filteredThumbnails}
                    ThumbnailComponent={this.renderThumbnail}
                    onThumbnailAdd={this.handleThumbnailAdd}
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
          </>
        )}
      </DataFilter>
    );
  }

  renderDetails(data: State["detailsData"]): ReactElement {
    const { type, onAddBlocks, onClose, HeaderSlotLeft } = this.props;
    return (
      <Details
        type={type}
        data={data}
        HeaderSlotLeft={HeaderSlotLeft}
        onAddBlocks={onAddBlocks}
        onBack={(): void => {
          this.setState({ detailsData: undefined });
        }}
        onClose={onClose}
      />
    );
  }

  render(): ReactElement {
    const { data, detailsData } = this.state;

    if (!data) {
      return this.renderLoading();
    }

    if (detailsData) {
      return this.renderDetails(detailsData);
    }

    return this.renderList(data);
  }
}
