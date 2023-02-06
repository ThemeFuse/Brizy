import { getClasses as apiGetClasses } from "../api";

export type Classes = Record<string, string>;

export const getClasses = (res, rej): void => {
  apiGetClasses()
    .then((r) => {
      res(r);
    })
    .catch((r) => {
      rej("Somehting went worn");
    });
};
