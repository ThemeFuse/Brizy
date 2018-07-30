import Editor from "visual/global/Editor";
import objectTraverse from "visual/utils/objectTraverse";
import { uuid } from "visual/utils/uuid";

export function stripIds(componentValue) {
  const replacer = (key, value) => (key === "_id" ? undefined : value);
  return JSON.parse(JSON.stringify(componentValue, replacer));
}

export function setIds(componentValue, options = {}) {
  const clonedValue = JSON.parse(JSON.stringify(componentValue));

  objectTraverse(clonedValue, setIdsCb, options);

  return clonedValue;
}
const setIdsCb = (key, value, obj, options) => {
  const isArrayComponent = key === "type" && Editor.getComponent(value) != null;
  if (isArrayComponent) {
    obj.value = obj.value || {};

    if (obj.value._id !== undefined && options.keepExistingIds) {
      return;
    }

    obj.value._id = uuid();
  }
};
