import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { loadCollectionItems, searchCollectionItems } from "visual/utils/api";
import {
  CURRENT_CONTEXT_TYPE,
  ORDER_BY_FIELD,
  createFieldCollectionId,
  fieldConverter,
  getManualTitle,
  orderByConverter
} from "visual/utils/elements/posts";
import type { ToolbarContext } from "visual/utils/elements/posts/types";
import { t } from "visual/utils/i18n";
import type { VDecoded, Value } from "../types";
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

  const sourceChoices =
    context.collectionTypesInfo?.sources.map((collectionType) => ({
      value: collectionType.id,
      title: collectionType.title
    })) ?? [];

  const orderByChoices = orderByConverter(
    v.source,
    context.collectionTypesInfo.sources
  );

  const fieldChoices = fieldConverter(
    v.source,
    context.collectionTypesInfo.sources
  );

  const isOrderByField = vd.orderBy === ORDER_BY_FIELD;
  const showField =
    isOrderByField && fieldChoices.length > 0;
  const collectionChoices = sourceChoices.filter(
    (c) => c.value !== CURRENT_CONTEXT_TYPE
  );

  const includeBy = getIncludeExclude({
    type: "include",
    vd,
    context,
    disabled: isCurrentQuery,
    config
  });
  const excludeBy = getIncludeExclude({
    type: "exclude",
    vd,
    context,
    disabled: isCurrentQuery,
    config
  });

  return [
    {
      id: "source",
      type: "select",
      label: t("Source"),
      devices: "desktop",
      choices: sourceChoices
    },
    {
      id: "querySource",
      type: "select",
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
      id: "field",
      type: "select",
      label: t("Field"),
      devices: "desktop",
      choices: fieldChoices,
      disabled: !showField
    },
    {
      id: "order",
      type: "radioGroup",
      label: t("Order"),
      devices: "desktop",
      choices: [
        { icon: "nc-up", value: "ASC" },
        { icon: "nc-down", value: "DESC" }
      ]
    }
  ];
}

interface IncExcl {
  type: "include" | "exclude";
  vd: VDecoded;
  context: ToolbarContext;
  disabled: boolean;
  config: ConfigCommon;
}

function getIncludeExclude({
  type,
  vd,
  context,
  disabled,
  config
}: IncExcl): ToolbarItemType {
  const include = type === "include";
  const prefix = include ? "inc" : "exc";
  const { source } = vd;
  const refs = context.collectionTypesInfo?.refsById[source] ?? [];
  const multiSelectPlaceholder = include ? t("All") : t("None");

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
          title: getManualTitle({ isManualSource })
        }
      ])
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
