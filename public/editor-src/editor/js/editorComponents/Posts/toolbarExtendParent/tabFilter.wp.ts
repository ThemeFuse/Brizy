import { Props as TabsOptionProps } from "visual/component/Options/types/dev/Tabs";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import Config, { WP } from "visual/global/Config";
import { ArrayType } from "visual/utils/array/types";
import { t } from "visual/utils/i18n";
import { V, VDecoded } from "../types";
import { CURRENT_CONTEXT_TYPE, decodeV } from "../utils.common";
import {
  authorsLoad,
  authorsSearch,
  manualLoad,
  manualSearch,
  termsLoad,
  termsSearch
} from "./utils.wp";

type TabOptionType = ArrayType<Required<TabsOptionProps>["tabs"]>;

export function tabFilter(v: V): TabOptionType | undefined {
  const isPosts = v.type === "posts";
  const isArchive = v.type === "archives";
  const isProducts = v.type === "products";
  const isProductArchive = v.type === "archives-product";

  if (!(isPosts || isArchive || isProducts || isProductArchive)) {
    return undefined;
  }

  const vd = decodeV(v);
  const isCurrentQuery = vd.source === CURRENT_CONTEXT_TYPE;

  const source = getSource(vd);
  const includeBy = getIncludeExclude(
    "include",
    vd,
    (!isPosts && !isProducts) || isCurrentQuery
  );
  const excludeBy = getIncludeExclude(
    "exclude",
    vd,
    (!isPosts && !isProducts) || isCurrentQuery
  );

  return {
    id: "filter",
    label: "Filter",
    options: [
      source,
      includeBy,
      excludeBy,
      {
        id: "offset",
        label: t("Offset"),
        type: "number-dev",
        devices: "desktop"
      },
      {
        id: "orderBy",
        type: "select-dev",
        label: t("Order By"),
        devices: "desktop",
        choices: [
          { title: t("ID"), value: "id" },
          { title: t("Title"), value: "title" },
          { title: t("Date"), value: "date" },
          { title: t("Random"), value: "rand" },
          { title: t("Comment Count"), value: "comment_count" }
        ]
      },
      {
        id: "order",
        type: "radioGroup-dev",
        label: t("Order"),
        devices: "desktop",
        choices: [
          { value: "ASC", icon: "nc-up" },
          { value: "DESC", icon: "nc-down" }
        ]
      }
    ]
  };
}

function getSource(vd: VDecoded): ToolbarItemType {
  const config = Config.getAll() as WP;
  const isPosts = vd.type === "posts";
  let choices: Array<{ title: string; value: string }> = [];

  if (isPosts) {
    choices = (config.wp.postLoopSources ?? []).map(({ label, name }) => ({
      title: label,
      value: name
    }));
  }

  return {
    id: "source",
    type: "select-dev",
    label: t("Source"),
    devices: "desktop",
    choices: choices,
    disabled: !isPosts
  };
}

function getIncludeExclude(
  type: "include" | "exclude",
  vd: VDecoded,
  disabled: boolean
): ToolbarItemType {
  const include = type === "include";
  const prefix = include ? "inc" : "exc";
  const source = vd.source;

  const refs = [
    {
      id: "term",
      title: t("Category"),
      load: termsLoad,
      search: termsSearch
    },
    {
      id: "author",
      title: t("Author"),
      load: authorsLoad,
      search: authorsSearch
    },
    {
      id: "manual",
      title: t("Manual"),
      load: manualLoad([source], []), // search only in posts of type {source}
      search: manualSearch([source], []) // search only in posts of type {source}
    }
  ];

  const multiSelectPlaceholder = include ? t("All") : t("None");

  const lvl1Option: ToolbarItemType = {
    id: `symbol_${source}_${prefix}By`,
    type: "multiSelect-dev",
    label: include ? t("Include By") : t("Exclude By"),
    devices: "desktop",
    placeholder: multiSelectPlaceholder,
    choices: refs.map((ref) => ({ value: ref.id, title: ref.title }))
  };

  const lvl2Options: ToolbarItemType[] = refs
    .filter((ref) => vd.symbols[`${source}_${prefix}By`]?.includes(ref.id))
    .map((ref) => {
      const id = `symbol_${source}_${prefix}_${ref.id}`;
      const label = ref.title;

      return {
        id,
        label,
        type: "multiSelect-dev",
        devices: "desktop",
        placeholder: multiSelectPlaceholder,
        choices: {
          load: ref.load,
          search: ref.search
        }
      };
    });

  return {
    id: `${prefix}By-group`,
    type: "group-dev",
    options: [lvl1Option, ...lvl2Options],
    disabled
  };
}
