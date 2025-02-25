import { isEqual } from "es-toolkit";
import { every, some } from "es-toolkit/compat";
import { getIn, setIn } from "timm";
import {
  ElementModel,
  ElementModelType
} from "visual/component/Elements/Types";
import { normalizeRowColumns } from "visual/editorComponents/Row/utils";
import { setIds } from "visual/utils/models";
import { MValue } from "visual/utils/value";
import { addIn, removeIn } from "./addRemove";

//#region Normalize Column Widths

export const normalizeColumnsWidths = (
  value: ElementModelType,
  path: string[],
  from?: { containerType?: string; containerPath?: string[] }
): ElementModelType => {
  const targetColumns = getIn(value, path) as MValue<ElementModelType[]>;
  const { containerType, containerPath } = from ?? {};
  const inCarousel =
    containerType === "carousel" && isEqual(containerPath, path);

  if (
    !targetColumns ||
    !every(targetColumns, ({ type }) => type === "Column") ||
    inCarousel
  ) {
    return value;
  }

  return setIn(
    value,
    path,
    normalizeRowColumns(targetColumns)
  ) as ElementModelType;
};

//#endregion

//#region Move Element & Move Columns

const isSourceFirst = (fromPath: string[], toPath: string[]): boolean => {
  return some(fromPath, (item, key) => item < toPath[key]);
};

const moveElement = (
  oldValue: ElementModelType,
  from: { itemPath: string[]; containerPath: string[]; containerType: string },
  to: { itemPath: string[]; containerPath: string[] },
  newValue: ElementModelType
): MValue<ElementModelType> => {
  let value;
  if (isSourceFirst(from.itemPath, to.itemPath)) {
    const valueAdded = addIn(oldValue, to.itemPath, newValue);

    if (valueAdded) {
      value = normalizeColumnsWidths(valueAdded, to.containerPath, from);
      const valueOmitted = removeIn(value, from.itemPath);

      if (valueOmitted) {
        return normalizeColumnsWidths(valueOmitted, from.containerPath, from);
      }
    }

    return undefined;
  } else {
    const valueOmitted = removeIn(oldValue, from.itemPath);

    if (valueOmitted) {
      value = normalizeColumnsWidths(valueOmitted, from.containerPath, from);
      const valueAdded = addIn(value, to.itemPath, newValue);

      if (valueAdded) {
        return normalizeColumnsWidths(valueAdded, to.containerPath, from);
      }
    }
    return undefined;
  }
};

const moveColumns = (
  oldValue: ElementModelType,
  from: { itemPath: string[]; containerPath: string[]; containerType: string },
  to: { itemPath: string[]; containerPath: string[] },
  newValue: ElementModelType
): MValue<ElementModelType> => {
  const sourceColumnPath = from.containerPath;
  const sourceColumns = getIn(oldValue, sourceColumnPath) as MValue<
    ElementModelType[]
  >;

  // if row is empty, we should delete it
  if (sourceColumns && sourceColumns.length <= 1) {
    let sourceRowItemPath = from.itemPath.slice(0, -3);
    let sourceRowContainerPath = from.itemPath.slice(0, -4);

    // if in wrapper has slider and slider is empty wee should delete wrapper
    const element = getIn(oldValue, sourceRowItemPath) as MValue<ElementModel>;

    if (element?.type === "Carousel") {
      sourceRowItemPath = sourceRowItemPath.slice(0, -3);
      sourceRowContainerPath = sourceRowContainerPath.slice(0, -4);
    }

    const newFrom = {
      ...from,
      itemPath: sourceRowItemPath,
      containerPath: sourceRowContainerPath
    };
    return moveElement(oldValue, newFrom, to, newValue);
  } else {
    return moveElement(oldValue, from, to, newValue);
  }
};

//#endregion

//#region Create IDS for ElementModel

const createNewItem = (
  type: string,
  value: ElementModel = {}
): ElementModelType => {
  return setIds({ type, value });
};

//#endregion

//#region SimpleMove

export const simpleMove = (
  oldValue: ElementModelType,
  from: { itemPath: string[] },
  to: { itemPath: string[] },
  movedElement = getIn(oldValue, from.itemPath) as MValue<ElementModelType>
): MValue<ElementModelType> => {
  let value;

  if (!movedElement) {
    return undefined;
  }

  if (from.itemPath.length < to.itemPath.length) {
    value = addIn(oldValue, to.itemPath, movedElement);

    if (value) {
      value = removeIn(value, from.itemPath);
    }

    return value;
  }

  value = removeIn(oldValue, from.itemPath);

  if (value) {
    value = addIn(value, to.itemPath, movedElement);
  }

  return value;
};

//#endregion

//#region Move Addable to [section, row, column]

export const moveAddableToSection = (
  oldValue: ElementModelType,
  from: { itemData: ElementModelType },
  to: { itemPath: string[] }
): MValue<ElementModelType> => {
  return addIn(oldValue, to.itemPath, from.itemData);
};

export const moveAddableToRow = (
  oldValue: ElementModelType,
  from: { itemData: ElementModelType },
  to: { itemPath: string[]; containerPath: string[] }
): MValue<ElementModelType> => {
  const { itemData } = from;
  const items = itemData.type !== "Row" ? [itemData] : [];

  const newColumn = createNewItem("Column", {
    _styles: ["column"],
    items
  });
  const value = addIn(oldValue, to.itemPath, newColumn);

  if (value) {
    return normalizeColumnsWidths(value, to.containerPath);
  }

  return undefined;
};

export const moveAddableToColumn = (
  oldValue: ElementModelType,
  from: { itemData: ElementModelType },
  to: { itemPath: string[] }
): MValue<ElementModelType> => {
  return addIn(oldValue, to.itemPath, from.itemData);
};

//#endregion

//#region Move Column to [section, row]

export const moveColumnToSection = (
  oldValue: ElementModelType,
  from: {
    itemPath: string[];
    containerPath: string[];
    containerType: string;
  },
  to: { itemPath: string[] }
): MValue<ElementModelType> => {
  const movedColumn = getIn(oldValue, from.itemPath) as ElementModelType;
  const newRow = createNewItem("Row", {
    _styles: ["row", "hide-row-borders", "padding-0"],
    items: normalizeRowColumns([movedColumn])
  });

  const newTo = {
    ...to,
    containerPath: [...to.itemPath, "value", "items"]
  };
  return moveColumns(oldValue, from, newTo, newRow);
};

export const moveColumnToAnotherRow = (
  oldValue: ElementModelType,
  from: { itemPath: string[]; containerPath: string[]; containerType: string },
  to: { itemPath: string[]; containerPath: string[] }
): MValue<ElementModelType> => {
  const movedColumn = getIn(
    oldValue,
    from.itemPath
  ) as MValue<ElementModelType>;

  if (movedColumn) {
    return moveColumns(oldValue, from, to, movedColumn);
  }

  return undefined;
};

//#endregion

//#region Move Shortcode to [section, row]

export const moveShortcodeToSection = (
  oldValue: ElementModelType,
  from: { itemPath: string[] },
  to: { itemPath: string[] },
  movedShortcode: ElementModelType
): MValue<ElementModelType> => {
  const value = removeIn(oldValue, from.itemPath);

  return value ? addIn(value, to.itemPath, movedShortcode) : undefined;
};

export const moveShortcodeToRow = (
  oldValue: ElementModelType,
  from: { itemPath: string[]; containerPath: string[]; containerType: string },
  to: { itemPath: string[]; containerPath: string[] },
  movedShortcode: ElementModelType
): MValue<ElementModelType> => {
  const newColumn = createNewItem("Column", {
    _styles: ["column"],
    items: [movedShortcode]
  });

  let value;
  if (from.itemPath.length < to.itemPath.length) {
    const newValue = addIn(oldValue, to.itemPath, newColumn);

    if (newValue) {
      value = normalizeColumnsWidths(newValue, to.containerPath, from);
      value = removeIn(value, from.itemPath);
      return value;
    }

    return undefined;
  }

  value = removeIn(oldValue, from.itemPath);

  if (value) {
    value = addIn(value, to.itemPath, newColumn);
  }

  if (value) {
    return normalizeColumnsWidths(value, to.containerPath, from);
  }

  return undefined;
};

//#endregion
