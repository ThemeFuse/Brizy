import { isInsideRect } from "visual/component/Sortable/plugin/utils";
import { DeviceMode, UserRole } from "visual/types";
import { OptionDefinition } from "visual/editorComponents/ToolbarItemType";
import { filter } from "visual/component/Options/types/utils/filter";
import { filterToolbarItems } from "visual/editorComponents/EditorComponent/utils";

export function selectorSearchDomTree(
  node: Element,
  selector: string,
  clickEvent: MouseEvent
): Element | null {
  let target = clickEvent.target as HTMLElement | null;

  while (target && target !== node) {
    if (target.matches(selector)) {
      return target;
    }

    target = target.parentElement;
  }

  return target;
}

export function selectorSearchCoordinates(
  node: Element,
  selector: string,
  clickEvent: MouseEvent
): Element | null {
  if (
    node.matches(selector) &&
    isInsideRect(
      clickEvent.clientX,
      clickEvent.clientY,
      node.getBoundingClientRect()
    )
  ) {
    return node;
  }

  const target = node.querySelectorAll(selector);
  for (let i = 0; i < target.length; i++) {
    const t = target[i];
    if (
      t &&
      isInsideRect(
        clickEvent.clientX,
        clickEvent.clientY,
        t.getBoundingClientRect()
      )
    ) {
      return t;
    }
  }

  return null;
}

export const filterOptions = (
  device: DeviceMode,
  role: UserRole
): ((o: OptionDefinition) => OptionDefinition) =>
  // @ts-expect-error, OptionDefinition type is not same ToolbarItemType, but it extends.
  // Anyway, we need to fix this
  filter(filterToolbarItems(device, role));
