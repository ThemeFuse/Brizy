import Editor from "visual/global/Editor";
import { objectTraverse } from "visual/utils/object";

const systemKeys = [
  "_thumbnailSrc",
  "_thumbnailWidth",
  "_thumbnailHeight",
  "_thumbnailTime"
];

const stripSystemKeysCb = (key, value, obj, finalKeys) => {
  const isArrayComponent = key === "type" && Editor.getComponent(value) != null;
  if (isArrayComponent) {
    // we removed globalBlockId property and GlobalBlock is linked by _id
    // this way we return undefined
    if (obj.value.type === "GlobalBlock") {
      return;
    }
  } else {
    // TEMP SOLUTION. FIND A BETTER WAY TO IMPLEMENT IT
    if (finalKeys.includes("_id")) {
      delete obj.value._id;
    }
  }

  if (finalKeys.includes(obj[key])) {
    delete obj[key];
  }
};

export function stripSystemKeys(componentValue, { exclude = [] } = {}) {
  const finalKeys = systemKeys.filter(key => !exclude.includes(key));

  const clonedValue = JSON.parse(JSON.stringify(componentValue));

  objectTraverse(clonedValue, stripSystemKeysCb, finalKeys);

  return clonedValue;
}
