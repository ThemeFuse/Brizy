import { getFields } from "../../api";
import {
  Choice,
  FilterFieldsData,
  Filters,
  PossibleValue,
  QueryTypeSource
} from "../../types/Filters";
import { t } from "../../utils/i18n";

export const handler: Filters["handler"] = async (res, rej, data) => {
  try {
    const result = await getFields(data);

    const convertedValue = converter(result);

    res(convertedValue ?? []);
  } catch (e) {
    rej(t("Failed to load sources"));
  }
};

export const possibleValues: Filters["possibleValues"] = async (
  res,
  rej,
  { type, search, optionSource, postId, loopAttributes }
) => {
  try {
    const result = await getFields({ postId, loopAttributes });

    const convertPossibleValues = parseFields(
      result,
      optionSource,
      type,
      search
    );

    res(convertPossibleValues ?? []);
  } catch (e) {
    rej(t("Failed to load sources"));
  }
};

const createQueryTypeSource = (
  query: string,
  type: string,
  source: string,
  filterBy: string
): QueryTypeSource => {
  return `${query}|||${type}|||${source}|||${filterBy}` as QueryTypeSource;
};

const converter = (data: FilterFieldsData): Choice[] => {
  const arr = Object.values(data).reduce((acc: Choice[], cur) => {
    const field = cur.map((item) => {
      return {
        value: createQueryTypeSource(
          item.filterQuery
            ? item.filterQuery
            : item.optionQuery
            ? item.optionQuery
            : `metaKey=${item.optionSource}`,
          item.type,
          item.optionSource,
          item.filterBy
        ),
        title: item.label
      };
    });
    return [...acc, ...field];
  }, []);

  return arr ?? [];
};

const parseFields = (
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
    const items: Choice[] = (
      selectedItem.possibleValues as PossibleValue[]
    ).map((it: PossibleValue) => ({
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

    if (checkNotNullOrUndefinedValues(items)) {
      return [allItem, ...items];
    }
  }

  if (selectedItem.optionSource === "meta") {
    const items = selectedItem.possibleValues as Choice[];

    if (search) {
      return [
        allItem,
        ...items.filter((it) =>
          it.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      ];
    }

    if (checkNotNullOrUndefinedValues(items)) {
      return [allItem, ...items];
    }
  }

  return [allItem];
};

function checkNotNullOrUndefinedValues(arr: unknown[]) {
  return arr.every((value) => value !== null && value !== undefined);
}
