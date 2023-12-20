import { getIn, insert, removeAt, setIn } from "timm";
import { ElementModelType } from "visual/component/Elements/Types";
import * as Num from "visual/utils/math/number";
import { MValue } from "visual/utils/value";

export const addIn = (
  object: ElementModelType,
  [...path]: (string | number)[],
  value: ElementModelType
): MValue<ElementModelType> => {
  const index = Num.read(path.pop());
  const obj = getIn(object, path) as MValue<ElementModelType[]>;

  if (obj && index !== undefined) {
    const newObj = insert(obj, index, value);
    return setIn(object, path, newObj) as ElementModelType;
  }

  return undefined;
};

export const removeIn = (
  object: ElementModelType,
  [...path]: (string | number)[]
): MValue<ElementModelType> => {
  const index = Num.read(path.pop());
  const obj = getIn(object, path) as MValue<ElementModelType[]>;

  if (obj && index !== undefined) {
    const newObj = removeAt(obj, index) as ElementModelType[];
    return setIn(object, path, newObj) as ElementModelType;
  }

  return undefined;
};
