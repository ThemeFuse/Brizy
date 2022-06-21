import { getIn, insert, removeAt, setIn } from "timm";
import * as Num from "visual/utils/math/number";
import { MValue } from "visual/utils/value";
import { ElementModel } from "visual/component/Elements/Types";

export const addIn = (
  object: ElementModel,
  [...path]: (string | number)[],
  value: ElementModel
): MValue<ElementModel> => {
  const index = Num.read(path.pop());
  const obj = getIn(object, path) as MValue<ElementModel[]>;

  if (obj && index !== undefined) {
    const newObj = insert(obj, index, value);
    return setIn(object, path, newObj) as ElementModel;
  }

  return undefined;
};

export const removeIn = (
  object: ElementModel,
  [...path]: (string | number)[]
): MValue<ElementModel> => {
  const index = Num.read(path.pop());
  const obj = getIn(object, path) as MValue<ElementModel[]>;

  if (obj && index !== undefined) {
    const newObj = removeAt(obj, index) as ElementModel[];
    return setIn(object, path, newObj) as ElementModel;
  }

  return undefined;
};
