import { Obj } from "@brizy/readers";
import { produce } from "immer";
import { ElementModel } from "visual/component/Elements/Types";
import { NumberSpec } from "visual/utils/math/number";

export function setOffsetsToElementFromWrapper(
  storyWrapper: ElementModel,
  rules: Record<string, string>,
  delta = 5
): ElementModel {
  // @ts-expect-error: Object is of type 'unknown'.
  const elem = storyWrapper.value.items[0].value;
  const _styles: string[] = elem._styles;
  let {
    offsetX = 0,
    offsetY = 0
  }: {
    _styles: string[];
    offsetX: number;
    offsetY: number;
  } = elem;
  const offsetsExists = NumberSpec.read(offsetX) && NumberSpec.read(offsetY);

  if (!offsetsExists && _styles && rules) {
    const styles = _styles.reduce(
      (acc, style) => {
        const rule = Obj.readKey(style)(rules);
        return rule ? Object.assign(acc, rule) : acc;
      },
      { offsetX: 0, offsetY: 0 } as Partial<ElementModel>
    );

    offsetX = styles.offsetX as number;
    offsetY = styles.offsetY as number;
  }

  return produce(storyWrapper, (draft) => {
    // is it a good solution?
    // @ts-expect-error: Object is of type 'unknown'.
    draft.value.items[0].value.offsetX = offsetX + delta;
    // @ts-expect-error: Object is of type 'unknown'.
    draft.value.items[0].value.offsetY = offsetY + delta;
  });
}
