import _ from "underscore";
import { ComponentItem } from "./type";
import * as types from "./types/index";

export const getTypeChoices = _.map(types, (item: ComponentItem) => {
  return {
    title: item.componentTitle,
    value: item.componentType
  };
});
