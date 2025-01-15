import { Props as TabsOptionProps } from "visual/component/Options/types/dev/Tabs";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { ArrayType } from "visual/utils/array/types";
import { t } from "visual/utils/i18n";
import { MValue } from "visual/utils/value";
import { CloudComponentConfig, Context, V, VDecoded } from "../types";
import { CURRENT_CONTEXT_TYPE, decodeV } from "../utils.common";
import { orderByConverter } from "./utils.common";
import {
  authorsLoad,
  authorsSearch,
  manualLoad,
  manualSearch,
  termsLoad,
  termsSearch
} from "./utils.wp";


type TabOptionType = ArrayType<Required<TabsOptionProps>["tabs"]>;

export function tabFilter(
  v: V,
  context: Context,
  componentConfig: MValue<CloudComponentConfig>,
  config: ConfigCommon
): TabOptionType | undefined {
  const isPosts = v.type === "posts";
  const isArchive = v.type === "archives";
  const isProducts = v.type === "products";
  const isProductArchive = v.type === "archives-product";

  if (!(isPosts || isArchive || isProducts || isProductArchive)) {
    return undefined;
  }

  const vd = decodeV(v);
  const isCurrentQuery = vd.source === CURRENT_CONTEXT_TYPE;

  const source = getSource(vd, context);
  const includeBy = getIncludeExclude(
    "include",
    vd,
    (!isPosts && !isProducts) || isCurrentQuery,
    componentConfig,
    config
  );
  const excludeBy = getIncludeExclude(
    "exclude",
    vd,
    (!isPosts && !isProducts) || isCurrentQuery,
    componentConfig,
    config
  );

  const orderByChoices = orderByConverter(
    v.source,
    context.collectionTypesInfo.sources
  );

  return {
    id: "filter",
    label: t("Filter"),
    options: [
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
    ]
  };
}

function getSource(vd: VDecoded, context: Context): ToolbarItemType {
  const isPosts = vd.type === "posts";

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
    choices: sourceChoices,
    disabled: !isPosts
  };
}

function getIncludeExclude(
  type: "include" | "exclude",
  vd: VDecoded,
  disabled: boolean,
  // @ts-expect-error is not used, but was sent to preserve the same structure as in Cloud
  componentConfig: MValue<CloudComponentConfig>,
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
