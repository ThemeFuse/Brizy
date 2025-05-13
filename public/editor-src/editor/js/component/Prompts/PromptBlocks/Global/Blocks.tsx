import React, {
  ComponentType,
  PropsWithChildren,
  ReactElement,
  useMemo,
  useRef
} from "react";
import Sidebar, {
  SidebarOption
} from "visual/component/Prompts/PromptBlocks/common/Sidebar";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { BlockMetaType } from "visual/types/GlobalBlock";
import { t } from "visual/utils/i18n";
import DataFilter from "../common/DataFilter";
import SearchInput from "../common/SearchInput";
import { Control as Select } from "../common/Select";
import { ALL_CAT, UNCATEGORISED_CAT } from "../types";
import { Empty } from "./controls/Empty";
import { Grid } from "./controls/Grid";
import { Loading } from "./controls/Loading";
import { Filter, Thumbnail } from "./types";
import { filterFn, getMessage, getSrc, getTags } from "./utils";

export interface Props<T extends Thumbnail> {
  data: Array<T>;
  HeaderSlotLeft?: ComponentType<PropsWithChildren<unknown>>;
  type: BlockMetaType;
  showSearch?: boolean;
  showSidebar?: boolean;
  showTitle?: boolean;
  loading?: boolean;
  onAdd: (data: T) => void;
  onRemove?: (data: T) => void;
  onUpdate?: (data: T) => void;
  isPopup: boolean;
  isPro: boolean;
  isStory: boolean;
  upgradeToPro?: string;
  config: ConfigCommon;
}

const defaultFilter = {
  search: "",
  tags: ALL_CAT
};

export const Blocks = <T extends Thumbnail>(props: Props<T>): ReactElement => {
  const {
    data,
    type,
    showSearch,
    showTitle,
    showSidebar,
    HeaderSlotLeft,
    loading,
    isPopup,
    isPro,
    isStory,
    upgradeToPro,
    config,
    onAdd,
    onRemove,
    onUpdate
  } = props;
  const currentFilterRef = useRef<Filter>(defaultFilter);

  const messageType = useMemo(() => {
    if (isPopup) {
      return "conditionPopup";
    }

    return type === "popup" ? "popup" : "block";
  }, [type, isPopup]);

  const tags = useMemo(() => getTags(data), [data]);

  return (
    <DataFilter<T, Filter>
      defaultFilter={defaultFilter}
      data={data}
      filterFn={filterFn}
    >
      {(filteredData, currentFilter, setFilter) => {
        const tagsWithoutAll = tags
          .filter(
            (tag) => tag.item !== ALL_CAT && tag.item !== UNCATEGORISED_CAT
          )
          .map((t) => t.item);

        return (
          <>
            {showSearch && HeaderSlotLeft && (
              <HeaderSlotLeft>
                <SearchInput
                  className="brz-ed-popup-two-header__search"
                  value={currentFilter.search}
                  onChange={(value: string): void => {
                    setFilter({ search: value });
                    currentFilterRef.current.search = value;
                  }}
                />
              </HeaderSlotLeft>
            )}

            {showSidebar && (
              <Sidebar>
                <SidebarOption title={t("TAG")}>
                  <Select<string>
                    value={currentFilter.tags}
                    choices={tags}
                    onChange={(value) => {
                      setFilter({ tags: value });
                      currentFilterRef.current.tags = value;
                    }}
                  />
                </SidebarOption>
              </Sidebar>
            )}

            {loading ? (
              <Loading />
            ) : filteredData.length === 0 ? (
              <Empty
                search={currentFilter.search}
                message={getMessage(messageType)}
                src={getSrc(messageType, config)}
              />
            ) : (
              <Grid<T>
                showTitle={showTitle}
                data={filteredData}
                tags={tagsWithoutAll}
                onAdd={onAdd}
                onRemove={onRemove}
                onUpdate={onUpdate}
                isStory={isStory}
                isPro={isPro}
                upgradeToPro={upgradeToPro}
                config={config}
              />
            )}
          </>
        );
      }}
    </DataFilter>
  );
};
