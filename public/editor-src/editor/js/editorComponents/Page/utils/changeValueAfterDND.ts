import { getIn, setIn } from "timm";
import _ from "underscore";
import { ElementModel } from "visual/component/Elements/Types";
import Config from "visual/global/Config";
import { globalBlocksAssembledSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { setIds } from "visual/utils/models";
import { MValue } from "visual/utils/value";
import { addIn } from "./helpers/addRemove";
import {
  moveAddableToColumn,
  moveAddableToRow,
  moveAddableToSection,
  moveColumnToAnotherRow,
  moveColumnToSection,
  moveShortcodeToRow,
  moveShortcodeToSection,
  simpleMove
} from "./helpers/move";
import {
  attachGlobalBlocks,
  attachMenu,
  detachGlobalBlocks,
  detachMenu,
  gbTransform
} from "./helpers/normalize";
import { normalizeFromTo } from "./helpers/path";
import { FromTo, isAddable, isColumn, isRow, isShortcode } from "./types";

function getValue(value: ElementModel, fromTo: FromTo): MValue<ElementModel> {
  let oldValue = value;

  if (isShortcode(fromTo)) {
    const { from, to } = fromTo;
    let movedElement = getIn(oldValue, from.itemPath) as MValue<ElementModel>;

    if (movedElement === undefined) {
      return undefined;
    }

    if (from.containerType === "cloneable") {
      const parentElement = getIn(
        oldValue,
        from.itemPath.slice(0, -3)
      ) as MValue<ElementModel>;

      if (parentElement === undefined) {
        return;
      }

      // if cloneable has only one item we remove it
      // @ts-expect-error:  Object is of type 'unknown'
      if (to.itemIndex !== undefined && parentElement.value.items.length <= 1) {
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

      const withNewIds: MValue<ElementModel> = setIds(
        setIn(parentElement, ["value", "items"], [movedElement])
      );

      if (withNewIds) {
        movedElement = withNewIds;
      }
    }

    switch (to.containerType) {
      case "column": {
        return simpleMove(oldValue, from, to, movedElement);
      }
      case "row": {
        return moveShortcodeToRow(oldValue, from, to, movedElement);
      }
      case "section": {
        return moveShortcodeToSection(oldValue, from, to, movedElement);
      }
    }
  }

  if (isColumn(fromTo)) {
    const { from, to } = fromTo;

    const parentElement = getIn(
      oldValue,
      from.itemPath.slice(0, -3)
    ) as MValue<ElementModel>;

    if (parentElement === undefined) {
      return undefined;
    }

    if (
      from.containerType === "posts" ||
      (from.containerType === "carousel" &&
        //@ts-expect-error: Object is of type 'unknown'.
        parentElement.value.dynamic === "on")
    ) {
      let model = getIn(oldValue, from.itemPath) as MValue<ElementModel>;

      if (model) {
        model = addIn(oldValue, from.itemPath, setIds(model));

        if (model) {
          // Cloned Column and changed the paths for the first column
          from.itemPath[from.itemPath.length - 1] = "0";
          oldValue = model;
        }
      }
    }

    switch (to.containerType) {
      case "column": {
        return moveColumnToSection(oldValue, from, to);
      }
      case "row": {
        return _.isEqual(from.containerPath, to.containerPath)
          ? simpleMove(oldValue, from, to)
          : moveColumnToAnotherRow(oldValue, from, to);
      }
      case "section": {
        return moveColumnToSection(oldValue, from, to);
      }
    }
  }

  if (isRow(fromTo)) {
    const { from, to } = fromTo;

    switch (to.containerType) {
      case "column":
      case "section":
        return simpleMove(
          oldValue,
          { itemPath: from.itemPath },
          { itemPath: to.itemPath }
        );
    }
  }

  if (isAddable(fromTo)) {
    const { from, to } = fromTo;

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

export default function changeValueAfterDND(
  oldValue: ElementModel,
  _fromTo: FromTo
): ElementModel {
  const config = Config.getAll();
  const { getState, dispatch } = getStore();
  const globalBlocks = globalBlocksAssembledSelector(getState());
  const oldValueWithoutGB = attachMenu({
    config,
    model: gbTransform(oldValue, globalBlocks),
    omitSymbols: true
  });
  const fromTo = normalizeFromTo(oldValueWithoutGB, _fromTo);

  let value = attachGlobalBlocks(oldValue, fromTo.from, globalBlocks);
  value = attachGlobalBlocks(value, fromTo.to, globalBlocks);
  value = attachMenu({ model: value, config });

  const _value = getValue(value, fromTo);

  if (_value) {
    value = _value;
  }

  value = detachMenu(value);
  value = detachGlobalBlocks(value, dispatch);

  return value;
}
