import { Props as TabsOptionProps } from "visual/component/Options/types/dev/Tabs";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import Config from "visual/global/Config";
import { loadCollectionItems, searchCollectionItems } from "visual/utils/api";
import { ArrayType } from "visual/utils/array/types";
import { t } from "visual/utils/i18n";
import { Context, V, VDecoded } from "../types";
import { CURRENT_CONTEXT_TYPE, decodeV } from "../utils.common";
import { createFieldCollectionId, useAsSimpleSelectConditions } from "./utils";
import { orderByConverter } from "./utils.common";

type TabOptionType = ArrayType<Required<TabsOptionProps>["tabs"]>;

export function tabFilter(v: V, context: Context): TabOptionType {
  const config = Config.getAll();

  const { elements = {} } = config;
  const { posts: postsElement } = elements ?? {};

  const disableExclude = postsElement?.exclude === false;
  const disableOffset = postsElement?.offset === false;
  const disableOrderBy = postsElement?.orderBy === false;
  const disableOrder = postsElement?.order === false;
  const disableSource = v?.showSource === false;

  const vd = decodeV(v);
  const isPosts = vd.type === "posts";
  const isCurrentQuery = vd.source === CURRENT_CONTEXT_TYPE;

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
    disabled: !isPosts || isCurrentQuery
  });
  const excludeBy = getIncludeExclude({
    type: "exclude",
    vd,
    context,
    disabled: !isPosts || isCurrentQuery || disableExclude
  });

  return {
    id: "filter",
    label: "Filter",
    options: [
      {
        id: "source",
        type: "select-dev",
        label: t("Source"),
        devices: "desktop",
        choices: sourceChoices,
        disabled: !isPosts || disableSource
      },
      {
        id: "querySource",
        type: "select-dev",
        label: t("Query Source"),
        devices: "desktop",
        choices: collectionChoices,
        disabled: !isCurrentQuery
      },
      includeBy,
      excludeBy,
      {
        id: "offset",
        label: t("Offset"),
        type: "number-dev",
        devices: "desktop",
        disabled: disableOffset
      },
      {
        id: "orderBy",
        type: "select-dev",
        label: t("Order By"),
        devices: "desktop",
        choices: orderByChoices,
        disabled: disableOrderBy
      },
      {
        id: "order",
        type: "radioGroup-dev",
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
}

function getIncludeExclude({
  type,
  vd,
  context,
  disabled
}: IncExcl): ToolbarItemType {
  const config = Config.getAll();

  const include = type === "include";
  const prefix = include ? "inc" : "exc";
  const source = vd.source;
  const refs = context.collectionTypesInfo?.refsById[source] ?? [];
  const multiSelectPlaceholder = include ? t("All") : t("None");

  const includeQueryOneOption =
    config?.elements?.posts?.includeQueryMultiOptions === false;

  const lvl1Option: ToolbarItemType = {
    id: `symbol_${source}_${prefix}By`,
    type: "multiSelect-dev",
    label: include ? t("Include by") : t("Exclude by"),
    devices: "desktop",
    placeholder: multiSelectPlaceholder,
    choices: refs
      .map((ref) => ({
        value: createFieldCollectionId(ref.id, ref.fieldId),
        title: ref.title
      }))
      .concat([{ value: "manual", title: t("Manual") }]),
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

      return {
        id,
        label,
        type: "multiSelect-dev",
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
          useAsSimpleSelect: useAsSimpleSelectConditions(vd),
          showArrow: useAsSimpleSelectConditions(vd)
        }
      };
    });

  if (vd.symbols[lvl1SymbolId]?.includes("manual")) {
    const id = context.collectionTypesInfo?.sources.find(
      (c) => c.id === source
    )?.id;

    if (id) {
      lvl2Options.push({
        id: `symbol_${source}_${prefix}_manual`,
        label: t("Manual"),
        type: "multiSelect-dev",
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
    type: "group-dev",
    options: [
      lvl1Option,
      ...lvl2Options,
      {
        id: "excludeCurrentProduct",
        type: "switch-dev",
        label: t("Exclude Current"),
        devices: "desktop",
        disabled: !vd?.excludeCurrentProductOption,
        helper: {
          content: t("Works only in the product page")
        }
      }
    ],
    disabled
  };
}
