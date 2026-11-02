import { Arr, Obj, Str } from "@brizy/readers";
import type { GroupBase } from "visual/component/Options/types/dev/Addable/types";
import type { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import type { ExpandedOption } from "visual/utils/options/utils/expand";
import { camelCase } from "visual/utils/string";

/**
 * The `default`s a group declares for its shape options, by group id.
 *
 * Read from the declaration, never from the model: a group is stored as `id`
 * and `title` only (@see ./converters.ts). A group added at runtime has none.
 */
const declaredGroupDefaults = (
  declaration: unknown,
  groupId: string
): Record<string, unknown> => {
  const groups = Arr.read(Obj.read(declaration)?.value) ?? [];
  const group = groups
    .map((g) => Obj.read(g))
    .find((g) => Str.read(g?.id) === groupId);

  return Obj.read(group?.defaults) ?? {};
};

/**
 * One option group per item of the value.
 */
export const expand = (option: OptionDefinition<"addable">): ExpandedOption => {
  const { id: addableId, shape, value, default: declared } = option;

  return {
    ...option,
    optionGroups: value.value.map((group: GroupBase) => {
      const defaults = declaredGroupDefaults(declared, group.id);

      return {
        id: group.id,
        title: group.title,
        // These ids are element model keys, so the format is append-only.
        // Minted here and nowhere else: the defaults are read back off the
        // options this expands into (@see EditorComponent/utils.ts
        // `expandedOptions`), so the two can not drift.
        options: shape.map((o) => ({
          ...o,
          id: camelCase([addableId, group.id, o.id]),
          default: defaults[o.id] ?? o.default
        }))
      };
    })
  } as ExpandedOption;
};
