import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  CURRENT_CONTEXT_TYPE,
  orderByConverter
} from "visual/utils/elements/posts";
import {
  authorsLoad,
  authorsSearch,
  manualLoad,
  manualSearch,
  termsLoad,
  termsSearch
} from "visual/utils/elements/posts/index.wp";
import { ToolbarContext } from "visual/utils/elements/posts/types";
import { t } from "visual/utils/i18n";
import { VDecoded, Value } from "../types";
import { decodeV } from "../utils.common";

export function tabFilter({
  v,
  context,
  config
}: {
  v: Value;
  context: ToolbarContext;
  config: ConfigCommon;
}): ToolbarItemType[] {
  const vd = decodeV(v);
  const isCurrentQuery = vd.source === CURRENT_CONTEXT_TYPE;

  const source = getSource(context);
  const includeBy = getIncludeExclude("include", vd, isCurrentQuery, config);
  const excludeBy = getIncludeExclude("exclude", vd, isCurrentQuery, config);

  const orderByChoices = orderByConverter(
    v.source,
    context.collectionTypesInfo.sources
  );

  return [
    source,
    includeBy,
    excludeBy,
    {
      id: "offset",
      label: t("Offset"),
      type: "number",
      devices: "desktop"
    },
    {
      id: "count",
      label: t("Count"),
      type: "number",
      devices: "desktop"
    },
    {
      id: "orderBy",
      type: "select",
      label: t("Order By"),
      devices: "desktop",
      choices: orderByChoices
    },
    {
      id: "order",
      type: "radioGroup",
      label: t("Order"),
      devices: "desktop",
      choices: [
        { value: "ASC", icon: "nc-up" },
        { value: "DESC", icon: "nc-down" }
      ]
    }
  ];
}

function getSource(context: ToolbarContext): ToolbarItemType {
  const sourceChoices =
    context.collectionTypesInfo?.sources.map((collectionType) => ({
      value: collectionType.id,
      title: collectionType.title
    })) ?? [];

  return {
    id: "source",
    type: "select",
    label: t("Source"),
    devices: "desktop",
    choices: sourceChoices
  };
}

function getIncludeExclude(
  type: "include" | "exclude",
  vd: VDecoded,
  disabled: boolean,
  config: ConfigCommon
): ToolbarItemType {
  const include = type === "include";
  const prefix = include ? "inc" : "exc";
  const source = vd.source;

  const refs = [
    {
      id: "term",
      title: t("Category"),
      load: termsLoad(config),
      search: termsSearch(config)
    },
    {
      id: "author",
      title: t("Author"),
      load: authorsLoad(config),
      search: authorsSearch(config)
    },
    {
      id: "manual",
      title: t("Manual"),
      load: manualLoad([source], [], config), // search only in posts of type {source}
      search: manualSearch([source], [], config) // search only in posts of type {source}
    }
  ];

  const multiSelectPlaceholder = include ? t("All") : t("None");

  const lvl1Option: ToolbarItemType = {
    id: `symbol_${source}_${prefix}By`,
    type: "multiSelect",
    label: include ? t("Include by") : t("Exclude by"),
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
        type: "multiSelect",
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
    type: "group",
    options: [lvl1Option, ...lvl2Options],
    disabled
  };
}
