import React, {
  Component,
  ComponentType,
  ReactElement,
  ReactNode
} from "react";
import Scrollbars from "react-custom-scrollbars";
import _ from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import Config from "visual/global/Config";
import {
  LayoutsWithThumbs,
  StoriesWithThumbs,
  TemplateWithPageProps,
  TemplateWithThumbs
} from "visual/global/Config/types/configs/templates";
import {
  defaultLayoutsMeta,
  defaultStoriesData,
  defaultStoriesMeta
} from "visual/utils/api";
import { t } from "visual/utils/i18n";
import DataFilter from "../common/DataFilter";
import SearchInput from "../common/SearchInput";
import Sidebar, { SidebarList, SidebarOption } from "../common/Sidebar";
import Thumbnail, { LayoutThumbnail } from "../common/Thumbnail";
import ThumbnailGrid, { ThumbnailProps } from "../common/ThumbnailGrid";
import { Data as ThumbnailData } from "../common/ThumbnailGrid";
import { PromptBlockTemplate } from "../types";
import Details from "./Details";
import { Category, Filter, Page, isStoryData } from "./types";
import { isBlock } from "visual/utils/api/common";

interface Data extends ThumbnailData, TemplateWithPageProps {}

export interface Props {
  type: "stories" | "layouts";
  showSidebar: boolean;
  showSearch: boolean;
  HeaderSlotLeft?: ComponentType;
  onAddBlocks: (b: PromptBlockTemplate) => void;
  onClose: VoidFunction;
  onNext: VoidFunction;
}

interface State {
  data: StoriesWithThumbs | LayoutsWithThumbs | undefined;
  detailsData: undefined | TemplateWithPageProps;
}

const defaultFilter: Filter = {
  category: "*",
  search: ""
};

export default class List extends Component<Props, State> {
  static defaultProps: Props = {
    type: "layouts",
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

  async getData(): Promise<StoriesWithThumbs | LayoutsWithThumbs | undefined> {
    try {
      return this.props.type === "layouts"
        ? await defaultLayoutsMeta(Config.getAll())
        : await defaultStoriesMeta(Config.getAll());
    } catch (e) {
      console.error(e);
      ToastNotification.error(t("Something went wrong on getting meta"));
    }
  }

  filterFn = (item: TemplateWithPageProps, cf: Filter): boolean => {
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

  getLayoutData(
    data: StoriesWithThumbs | LayoutsWithThumbs
  ): Array<TemplateWithThumbs> {
    if (isStoryData(data)) {
      return data.stories;
    } else {
      return data.templates;
    }
  }

  handleThumbnailAdd = (thumbnailData: State["detailsData"]): void => {
    this.setState({ detailsData: thumbnailData });
  };

  handleBlankThumbnailAdd = async (data: Page): Promise<void> => {
    const { onAddBlocks, onClose } = this.props;
    const blockData = await defaultStoriesData(Config.getAll(), data.id);
    const resolve = isBlock(blockData)
      ? { ...blockData, blockId: data.id }
      : { ...blockData.blocks[0], blockId: data.id };

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

  renderList(data: StoriesWithThumbs | LayoutsWithThumbs): ReactElement {
    const { showSidebar, showSearch } = this.props;
    const blocks = this.getLayoutData(data);

    const thumbnails = blocks.map((el) => ({
      ...el,
      ...el.pages[0]
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
    const categories = (
      [
        {
          id: "*",
          title: t("All Categories")
        }
      ] as Category[]
    )
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
