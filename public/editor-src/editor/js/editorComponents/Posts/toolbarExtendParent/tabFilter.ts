import { Str } from "@brizy/readers";
import { Props as TabsOptionProps } from "visual/component/Options/types/dev/Tabs";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import Config from "visual/global/Config";
import { loadCollectionItems, searchCollectionItems } from "visual/utils/api";
import { ArrayType } from "visual/utils/array/types";
import { t } from "visual/utils/i18n";
import { MValue } from "visual/utils/value";
import { CloudComponentConfig, Context, V, VDecoded } from "../types";
import { CURRENT_CONTEXT_TYPE, decodeV } from "../utils.common";
import {
  createFieldCollectionId,
  getManualTitle,
  useAsSimpleSelectConditions
} from "./utils";
import { orderByConverter } from "./utils.common";

type TabOptionType = ArrayType<Required<TabsOptionProps>["tabs"]>;

export function tabFilter(
  v: V,
  context: Context,
  componentConfig: MValue<CloudComponentConfig>
): TabOptionType {
  const config = Config.getAll();

  const vd = decodeV(v);

  const { exclude, querySource, getIncludeDisabledValue } =
    componentConfig ?? {};
  const { elements = {} } = config;
  const { posts: postsElement } = elements ?? {};

  const disableExclude = exclude === false || postsElement?.exclude === false;
  const disableOffset = postsElement?.offset === false;
  const disableOrderBy = postsElement?.orderBy === false;
  const disableOrder = postsElement?.order === false;
  const disableQuerySource =
    querySource === false || postsElement?.querySource === false;

  const isPosts = vd.type === "posts";
  const isCurrentQuery = vd.source === CURRENT_CONTEXT_TYPE;
  const isIncludeDisabled =
    typeof getIncludeDisabledValue === "function"
      ? getIncludeDisabledValue(vd.source)
      : false;

  const sourceChoices =
    context.collectionTypesInfo?.sources.map((collectionType) => ({
      value: collectionType.id,
      title: collectionType.title
    })) ?? [];

  const orderByChoices = orderByConverter(
    v.source,
    context.collectionTypesInfo.sources
  );

  const collectionChoices = sourceChoices.filter(
    (c) => c.value !== CURRENT_CONTEXT_TYPE
  );

  const includeBy = getIncludeExclude({
    type: "include",
    vd,
    context,
    disabled: !isPosts || isCurrentQuery || isIncludeDisabled,
    componentConfig
  });
  const excludeBy = getIncludeExclude({
    type: "exclude",
    vd,
    context,
    disabled: !isPosts || isCurrentQuery || disableExclude
  });

  return {
    id: "filter",
    label: t("Filter"),
    options: [
      {
        id: "source",
        type: "select",
        label: t("Source"),
        devices: "desktop",
        choices: sourceChoices,
        disabled: !isPosts
      },
      {
        id: "querySource",
        type: "select",
        label: t("Query Source"),
        devices: "desktop",
        choices: collectionChoices,
        disabled: disableQuerySource || !isCurrentQuery
      },
      includeBy,
      {
        id: "excludeCurrentProduct",
        type: "switch",
        label: t("Exclude Current"),
        devices: "desktop",
        disabled: !vd?.excludeCurrentProductOption,
        helper: {
          content: t("Works only in the product page")
        }
      },
      excludeBy,
      {
        id: "offset",
        label: t("Offset"),
        type: "number",
        devices: "desktop",
        disabled: disableOffset
      },
      {
        id: "orderBy",
        type: "select",
        label: t("Order By"),
        devices: "desktop",
        choices: orderByChoices,
        disabled: disableOrderBy
      },
      {
        id: "order",
        type: "radioGroup",
        label: t("Order"),
        devices: "desktop",
        choices: [
          { icon: "nc-up", value: "ASC" },
          { icon: "nc-down", value: "DESC" }
        ],
        disabled: disableOrder
      }
    ]
  };
}

interface IncExcl {
  type: "include" | "exclude";
  vd: VDecoded;
  context: Context;
  disabled: boolean;
  componentConfig?: CloudComponentConfig;
}

function getIncludeExclude({
  type,
  vd,
  context,
  disabled,
  componentConfig
}: IncExcl): ToolbarItemType {
  const config = Config.getAll();

  const include = type === "include";
  const prefix = include ? "inc" : "exc";
  const { source, component } = vd;
  const refs = context.collectionTypesInfo?.refsById[source] ?? [];
  const multiSelectPlaceholder = include ? t("All") : t("None");

  const includeQueryOneOption =
    componentConfig?.includeQueryMultiOptions === false ||
    config?.elements?.posts?.includeQueryMultiOptions === false;
  const isManualSource = source === "manual";

  const lvl1Option: ToolbarItemType = {
    id: `symbol_${source}_${prefix}By`,
    type: "multiSelect",
    label: include ? t("Include by") : t("Exclude by"),
    devices: "desktop",
    placeholder: multiSelectPlaceholder,
    choices: refs
      .map((ref) => ({
        value: createFieldCollectionId(ref.id, ref.fieldId),
        title: ref.title
      }))
      .concat([
        {
          value: "manual",
          title: getManualTitle({ type: component, isManualSource })
        }
      ]),
    config: {
      useAsSimpleSelect: includeQueryOneOption,
      showArrow: includeQueryOneOption
    }
  };

  const lvl1SymbolId = `${source}_${prefix}By`;
  const lvl2Options: ToolbarItemType[] = refs
    .filter((ref) => {
      return vd.symbols[lvl1SymbolId]?.includes(
        createFieldCollectionId(ref.id, ref.fieldId)
      );
    })
    .map((ref) => {
      const _id = createFieldCollectionId(ref.id, ref.fieldId);
      const id = `symbol_${source}_${prefix}_${_id}`;
      const label = ref.title;

      const useAsSimpleSelect = useAsSimpleSelectConditions(vd);

      return {
        id,
        label,
        type: "multiSelect",
        devices: "desktop",
        placeholder: multiSelectPlaceholder,
        choices: {
          load: loadCollectionItems(
            { collectionId: ref.id, fieldId: ref.fieldId },
            config
          ),
          search: searchCollectionItems(
            {
              collectionId: ref.id,
              fieldId: ref.fieldId
            },
            config
          )
        },
        config: {
          useAsSimpleSelect,
          showArrow: useAsSimpleSelect
        }
      };
    });

  if (vd.symbols[lvl1SymbolId]?.includes("manual")) {
    const id =
      Str.read(componentConfig?.manualId) ??
      context.collectionTypesInfo?.sources.find((c) => c.id === source)?.id;

    if (id) {
      lvl2Options.push({
        id: `symbol_${source}_${prefix}_manual`,
        label: t("Manual"),
        type: "multiSelect",
        devices: "desktop",
        placeholder: multiSelectPlaceholder,
        choices: {
          load: loadCollectionItems({ collectionId: id }, config),
          search: searchCollectionItems({ collectionId: id }, config)
        }
      });
    }
  }

  return {
    id: `${prefix}By-group`,
    type: "group",
    options: [lvl1Option, ...lvl2Options],
    disabled
  };
}
