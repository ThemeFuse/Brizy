import {
  Choice,
  FilterFieldsData,
  fromStringQueryTypeSource,
  isChoiceArray,
  isPossibleValueArray,
  PossibleValue,
  QueryTypeSource
} from "../../types/Filters";
import { isAllValuesValid } from "../../utils/reader/array";

export const createQueryTypeSource = (
  query: string,
  type: string,
  source: string,
  filterBy: string
): QueryTypeSource | undefined =>
  fromStringQueryTypeSource(`${query}|||${type}|||${source}|||${filterBy}`);

export const converter = (data: FilterFieldsData): Choice[] => {
  const arr = Object.values(data).reduce((acc: Choice[], cur) => {
    const field = cur.map((item) => {
      return {
        value:
          createQueryTypeSource(
            getQuery(item.filterQuery, item.optionQuery, item.optionSource),
            item.type,
            item.optionSource,
            item.filterBy
          ) ?? "",
        title: item.label
      };
    });
    return [...acc, ...field];
  }, []);

  return arr ?? [];
};

export const getQuery = (
  filterQuery: string,
  optionQuery: string,
  optionSource: string
): string => filterQuery || optionQuery || `metaKey=${optionSource}`;

export const parseFields = (
  data: FilterFieldsData,
  optionSource: string,
  type: string,
  search?: string
): Choice[] => {
  const allItem = { value: "all", title: type === "inc" ? "All" : "None" };

  const selectedItem = Object.values(data).reduce((acc, cur) => {
    const field = cur.filter((item) => item.optionQuery === optionSource);

    return [...acc, ...field];
  }, [])[0];

  if (selectedItem.optionSource === "tax") {
    const parsedValues: PossibleValue[] = isPossibleValueArray(
      selectedItem.possibleValues
    )
      ? selectedItem.possibleValues
      : [];
    const items: Choice[] = parsedValues.map((it) => ({
      value: it.term_id,
      title: it.name
    }));

    if (search) {
      return [
        allItem,
        ...items.filter((it) =>
          it.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      ];
    }

    if (isAllValuesValid(items)) {
      return [allItem, ...items];
    }
  }

  if (selectedItem.optionSource === "meta") {
    const items = isChoiceArray(selectedItem.possibleValues)
      ? selectedItem.possibleValues
      : [];

    if (search) {
      return [
        allItem,
        ...items.filter((it) =>
          it.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      ];
    }

    if (isAllValuesValid(items)) {
      return [allItem, ...items];
    }
  }

  return [allItem];
};
