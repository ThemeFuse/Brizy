import type { OptionName } from "visual/component/Options/types";
import type { GroupBase } from "visual/component/Options/types/dev/Addable/types";
import type {
  OptionDefinition,
  ToolbarItemType
} from "visual/editorComponents/ToolbarItemType";
import { expand as addable } from "visual/utils/options/Addable/expand";

/**
 * An option carrying the sub-options it built from its value.
 *
 * `optionGroups` is injected, never declared — `GenericToolbarItemType` omits
 * it — and it is the whole contract: the defaults walk reads it back (@see
 * EditorComponent/utils.ts `expandedOptions`) and the option's own component
 * receives it as a prop.
 *
 * Its options are `ToolbarItemType`, not `OptionDefinition`: they only gain
 * `value`/`onChange` once the renderer binds them.
 */
export type ExpandedOption = ToolbarItemType & {
  optionGroups: Array<GroupBase & { options: ToolbarItemType[] }>;
};

/**
 * Builds the sub-options an option contains out of its own value. Only an
 * option whose children are *not* in its declaration needs one — `tabs`,
 * `popover`, `group` and `grid` all declare theirs in the toolbar.
 */
export type Expand<T extends OptionName> = (
  option: OptionDefinition<T>
) => ExpandedOption;

// Opt-in, not exhaustive: an option type that does not expand says nothing here.
const fns: Partial<{ [T in OptionName]: Expand<T> }> = {
  addable
};

// `hasOwn`, not a property lookup: `type` comes from a toolbar declaration,
// third party ones included, and `fns["toString"]` inherits a function.
export const expands = (type: string): boolean => Object.hasOwn(fns, type);

export const expand = <T extends OptionDefinition | ToolbarItemType>(
  option: T
): T => {
  const fn = (
    expands(option.type) ? fns[option.type as OptionName] : undefined
  ) as ((o: T) => T) | undefined;

  return fn ? fn(option) : option;
};
