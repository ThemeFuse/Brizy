import produce from "immer";
import { NumberSpec } from "visual/utils/math/number";
import { getStore } from "visual/redux/store";
import { rulesSelector } from "visual/redux/selectors";
import { ElementModel } from "visual/component/Elements/Types";

export function setOffsetsToElementFromWrapper(
  storyWrapper: ElementModel,
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
  const currentStyleRules = rulesSelector(getStore().getState());

  const offsetsExists = NumberSpec.read(offsetX) && NumberSpec.read(offsetY);
  if (!offsetsExists && _styles && currentStyleRules) {
    const styles = _styles.reduce(
      (acc, style) =>
        currentStyleRules[style]
          ? Object.assign(acc, currentStyleRules[style])
          : acc,
      { offsetX: 0, offsetY: 0 } as Partial<ElementModel>
    );

    offsetX = styles.offsetX as number;
    offsetY = styles.offsetY as number;
  }

  return produce(storyWrapper, draft => {
    // is it a good solution?
    // @ts-expect-error: Object is of type 'unknown'.
    draft.value.items[0].value.offsetX = offsetX + delta;
    // @ts-expect-error: Object is of type 'unknown'.
    draft.value.items[0].value.offsetY = offsetY + delta;
  });
}
