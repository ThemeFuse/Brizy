import { setIn, getIn, removeAt, insert } from "timm";
import produce from "immer";
import _ from "underscore";
import { getStore } from "visual/redux/store";
import { globalBlocksAssembled2Selector } from "visual/redux/selectors";
import { updateGlobalBlock } from "visual/redux/actions";
import { normalizeRowColumns } from "visual/editorComponents/Row/utils";
import { setIds } from "visual/utils/models";
import { objectTraverse2 } from "visual/utils/object";

// timm helpers
const addIn = (object, [...path], value) => {
  let index = path.pop();
  index = Number(index) ? Number(index) : index;
  let newObj = getIn(object, path);
  newObj = insert(newObj, index, value);

  return setIn(object, path, newObj);
};
const removeIn = (object, [...path]) => {
  let index = path.pop();
  index = Number(index) ? Number(index) : index;
  let newObj = getIn(object, path);
  newObj = removeAt(newObj, index);

  return setIn(object, path, newObj);
};

function attachGlobalBlocks(value, source) {
  const globalBlocks = globalBlocksAssembled2Selector(getStore().getState());
  const { itemPath = [] } = source;
  const transformed = produce(value, draft => {
    let cursor = draft;
    let i = 0;

    do {
      if (cursor.type && cursor.type === "GlobalBlock" && cursor.value) {
        const { globalBlockId } = cursor.value;

        if (globalBlocks[globalBlockId]) {
          Object.assign(cursor, globalBlocks[globalBlockId], {
            __tmp_global_original__: JSON.stringify(cursor)
          });
        }
      }

      cursor = cursor[itemPath[i++]];
    } while (i < itemPath.length);
  });

  return transformed;
}

function detachGlobalBlocks(value, source) {
  const globalBlockUpdates = [];
  const ret = produce(value, draft => {
    objectTraverse2(draft, obj => {
      if (obj.__tmp_global_original__) {
        // restore replaced global block (1)
        const tmp = JSON.parse(obj.__tmp_global_original__);
        delete obj.__tmp_global_original__;

        // mark up global block for later update
        globalBlockUpdates.push([tmp.value.globalBlockId, JSON.stringify(obj)]);

        // restore replaced global block (2)
        Object.assign(obj, tmp);
      }
    });
  });

  if (globalBlockUpdates.length) {
    for (const [globalBlockId, dataStringified] of globalBlockUpdates) {
      getStore().dispatch(
        updateGlobalBlock({
          id: globalBlockId,
          data: JSON.parse(dataStringified)
        })
      );
    }
  }

  return ret;
}

export default function changeValueAfterDND(oldValue, { from, to }) {
  let value = attachGlobalBlocks(oldValue, from);
  value = attachGlobalBlocks(value, to);

  value = getValue(value, { from, to });

  value = detachGlobalBlocks(value, from);
  value = detachGlobalBlocks(value, to);

  return value;
}

function getValue(value, { from, to }) {
  let oldValue = value;

  if (from.itemType === "shortcode") {
    let movedElement = getIn(oldValue, from.itemPath);
    if (from.containerType === "cloneable") {
      let parentElement = getIn(oldValue, from.itemPath.slice(0, -3));
      // if cloneable has only one item we remove it
      if (parentElement.value.items.length <= 1) {
        from.containerPath = from.itemPath.slice(0, -4);
        from.itemPath = from.itemPath.slice(0, -3);
        from.itemIndex = Number(from.itemPath[from.itemPath.length - 1]);

        // if the cloneable will be removed
        // and we do not decrement to.index then
        // it will go one position after the desired one
        // in the case when dragging from up to down
        if (
          _.isEqual(from.containerPath, to.containerPath) &&
          from.itemIndex < to.itemIndex
        ) {
          to.itemIndex--;
          to.itemPath[to.itemPath.length - 1] = String(to.itemIndex);
        }
      }

      movedElement = setIds(
        setIn(parentElement, ["value", "items"], [movedElement])
      );
    }

    switch (to.containerType) {
      case "column":
        return simpleMove(oldValue, from, to, movedElement);
      case "row":
        return moveShortcodeToRow(oldValue, from, to, movedElement);
      case "section":
        return moveShortcodeToSection(oldValue, from, to, movedElement);
    }
  }

  if (from.itemType === "column") {
    const parentElement = getIn(oldValue, from.itemPath.slice(0, -3));

    if (
      from.containerType === "posts" ||
      (from.containerType === "carousel" &&
        parentElement.value.dynamic === "on")
    ) {
      // Cloned Column and changed the paths for the first column
      from.itemPath[from.itemPath.length - 1] = "0";
      const movedElement = setIds(getIn(oldValue, from.itemPath));
      oldValue = addIn(oldValue, from.itemPath, movedElement);
    }

    switch (to.containerType) {
      case "column":
        return moveColumnToSection(oldValue, from, to);
      case "row":
        return _.isEqual(from.containerPath, to.containerPath)
          ? simpleMove(oldValue, from, to)
          : moveColumnToAnotherRow(oldValue, from, to);
      case "section":
        return moveColumnToSection(oldValue, from, to);
    }
  }

  if (from.itemType === "row") {
    switch (to.containerType) {
      case "column":
      case "section":
        return simpleMove(oldValue, from, to);
    }
  }

  if (from.itemType === "addable") {
    switch (to.containerType) {
      case "column":
        return moveAddableToColumn(oldValue, from, to);
      case "row":
        return moveAddableToRow(oldValue, from, to);
      case "section":
        return moveAddableToSection(oldValue, from, to);
    }
  }

  return oldValue;
}

const moveAddableToColumn = (oldValue, from, to) => {
  return addIn(oldValue, to.itemPath, from.itemData);
};

const simpleMove = (
  oldValue,
  from,
  to,
  movedElement = getIn(oldValue, from.itemPath)
) => {
  let value;
  if (from.itemPath.length < to.itemPath.length) {
    value = addIn(oldValue, to.itemPath, movedElement);
    value = removeIn(value, from.itemPath);

    return value;
  }

  value = removeIn(oldValue, from.itemPath);
  value = addIn(value, to.itemPath, movedElement);

  return value;
};

const moveColumnToAnotherRow = (oldValue, from, to) => {
  const movedColumn = getIn(oldValue, from.itemPath);

  return moveColumns(oldValue, from, to, movedColumn);
};

const moveAddableToRow = (oldValue, from, to) => {
  const { itemData } = from;
  const items = itemData.type !== "Row" ? [itemData] : [];

  const newColumn = createNewItem("Column", {
    _styles: ["column"],
    items
  });
  const value = addIn(oldValue, to.itemPath, newColumn);

  return normalizeColumnsWidths(value, to.containerPath, from);
};

const moveShortcodeToRow = (oldValue, from, to, movedShortcode) => {
  const newColumn = createNewItem("Column", {
    _styles: ["column"],
    items: [movedShortcode]
  });

  let value;
  if (from.itemPath.length < to.itemPath.length) {
    value = normalizeColumnsWidths(
      addIn(oldValue, to.itemPath, newColumn),
      to.containerPath,
      from
    );
    value = removeIn(value, from.itemPath);

    return value;
  }

  value = removeIn(oldValue, from.itemPath);
  value = addIn(value, to.itemPath, newColumn);

  return normalizeColumnsWidths(value, to.containerPath, from);
};

const moveShortcodeToSection = (oldValue, from, to, movedShortcode) => {
  let value = removeIn(oldValue, from.itemPath);

  return addIn(value, to.itemPath, movedShortcode);
};

const moveAddableToSection = (oldValue, from, to) => {
  return addIn(oldValue, to.itemPath, from.itemData);
};

const moveColumnToSection = (oldValue, from, to) => {
  const movedColumn = getIn(oldValue, from.itemPath);
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

const normalizeColumnsWidths = (value, path, from) => {
  const targetColumns = getIn(value, path);
  const { containerType, containerPath } = from;
  const inCarousel =
    containerType === "carousel" && _.isEqual(containerPath, path);

  if (
    !targetColumns ||
    !_.every(targetColumns, ({ type }) => type === "Column") ||
    inCarousel
  )
    return value;

  return setIn(value, path, normalizeRowColumns(targetColumns));
};

const createNewItem = (type, value = {}) => {
  return setIds({ type, value });
};

const isSourceFirst = (fromPath, toPath) => {
  return _.some(fromPath, (item, key) => {
    return item < toPath[key];
  });
};

const moveElement = (oldValue, from, to, newValue) => {
  let value;
  if (isSourceFirst(from.itemPath, to.itemPath)) {
    value = normalizeColumnsWidths(
      addIn(oldValue, to.itemPath, newValue),
      to.containerPath,
      from
    );
    return normalizeColumnsWidths(
      removeIn(value, from.itemPath),
      from.containerPath,
      from
    );
  } else {
    value = normalizeColumnsWidths(
      removeIn(oldValue, from.itemPath),
      from.containerPath,
      from
    );
    return normalizeColumnsWidths(
      addIn(value, to.itemPath, newValue),
      to.containerPath,
      from
    );
  }
};

const moveColumns = (oldValue, from, to, newValue) => {
  const sourceColumnPath = from.containerPath;
  const sourceColumns = getIn(oldValue, sourceColumnPath);

  // if row is empty, we should delete it
  if (sourceColumns.length <= 1) {
    const sourceRowItemPath = from.itemPath.slice(0, -3);
    const sourceRowContainerPath = from.itemPath.slice(0, -4);

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
