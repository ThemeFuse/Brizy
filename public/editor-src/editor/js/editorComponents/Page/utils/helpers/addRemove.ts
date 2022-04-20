import { getIn, insert, removeAt, setIn } from "timm";
import { MValue } from "visual/utils/value";
import { ElementModel } from "visual/component/Elements/Types";

export const addIn = (
  object: ElementModel,
  [...path],
  value: ElementModel
): MValue<ElementModel> => {
  let index = path.pop();
  index = Number(index) ? Number(index) : index;
  const obj = getIn(object, path) as MValue<ElementModel[]>;

  if (obj) {
    const newObj = insert(obj, index, value);
    return setIn(object, path, newObj) as ElementModel;
  }

  return undefined;
};

export const removeIn = (
  object: ElementModel,
  [...path]
): MValue<ElementModel> => {
  let index = path.pop();
  index = Number(index) ? Number(index) : index;
  const obj = getIn(object, path) as MValue<ElementModel[]>;

  if (obj) {
    const newObj = removeAt(obj, index) as ElementModel[];
    return setIn(object, path, newObj) as ElementModel;
  }

  return undefined;
};
