import { Props as TabsOptionProps } from "visual/component/Options/types/dev/Tabs";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { ArrayType } from "visual/utils/array/types";
import { t } from "visual/utils/i18n";
import { Context, V, VDecoded } from "../types";
import { CURRENT_CONTEXT_TYPE, decodeV } from "../utils.common";
import {
  createFieldCollectionId,
  lvl2MultiSelectLoad,
  lvl2MultiSelectSearch
} from "./utils";

type TabOptionType = ArrayType<Required<TabsOptionProps>["tabs"]>;

export function tabFilter(v: V, context: Context): TabOptionType {
  const vd = decodeV(v);
  const isPosts = vd.type === "posts";
  const isCurrentQuery = vd.source === CURRENT_CONTEXT_TYPE;
  const sourceChoices =
    context.collectionTypesInfo?.collectionTypes.map((collectionType) => ({
      value: collectionType.id,
      title: collectionType.title
    })) ?? [];
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
    disabled: !isPosts || isCurrentQuery
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
        disabled: !isPosts
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
      },
      {
        id: "orderBy",
        type: "select-dev",
        label: t("Order By"),
        devices: "desktop",
        choices: [
          { title: t("ID"), value: "id" },
          { title: t("Title"), value: "title" }
        ]
      },
      {
        id: "order",
        type: "radioGroup-dev",
        label: t("Order"),
        devices: "desktop",
        choices: [
          { icon: "nc-up", value: "ASC" },
          { icon: "nc-down", value: "DESC" }
        ]
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
  const include = type === "include";
  const prefix = include ? "inc" : "exc";
  const source = vd.source;
  const refs = context.collectionTypesInfo?.refsById[source] ?? [];
  const multiSelectPlaceholder = include ? t("All") : t("None");

  const lvl1Option: ToolbarItemType = {
    id: `symbol_${source}_${prefix}By`,
    type: "multiSelect-dev",
    label: include ? t("Include By") : t("Exclude By"),
    devices: "desktop",
    placeholder: multiSelectPlaceholder,
    choices: refs
      .map((ref) => ({
        value: createFieldCollectionId(ref.id, ref.fieldId),
        title: ref.title
      }))
      .concat([{ value: "manual", title: t("Manual") }])
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
          load: lvl2MultiSelectLoad(ref.id, ref.fieldId),
          search: lvl2MultiSelectSearch(ref.id, ref.fieldId)
        }
      };
    });

  if (vd.symbols[lvl1SymbolId]?.includes("manual")) {
    const id = context.collectionTypesInfo?.collectionTypes.find(
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
          load: lvl2MultiSelectLoad(id),
          search: lvl2MultiSelectSearch(id)
        }
      });
    }
  }

  return {
    id: `${prefix}By-group`,
    type: "group-dev",
    options: [lvl1Option, ...lvl2Options],
    disabled
  };
}
