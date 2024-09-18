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
import Config from "visual/global/Config";
import { BlockMetaType } from "visual/types";
import { t } from "visual/utils/i18n";
import { isPopup } from "visual/utils/models";
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
    onAdd,
    onRemove,
    onUpdate
  } = props;
  const currentFilterRef = useRef<Filter>(defaultFilter);

  const messageType = useMemo(() => {
    const config = Config.getAll();

    if (isPopup(config)) {
      return "conditionPopup";
    }

    return type === "popup" ? "popup" : "block";
  }, [type]);

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
                src={getSrc(messageType)}
              />
            ) : (
              <Grid<T>
                showTitle={showTitle}
                data={filteredData}
                tags={tagsWithoutAll}
                onAdd={onAdd}
                onRemove={onRemove}
                onUpdate={onUpdate}
              />
            )}
          </>
        );
      }}
    </DataFilter>
  );
};
