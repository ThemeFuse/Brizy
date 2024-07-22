import { MarkerType } from "visual/editorComponents/TableOfContents/types";
import * as Arr from "visual/utils/reader/array";
import * as Json from "visual/utils/reader/json";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { isValidSelector } from "visual/utils/selector";
import type { State } from "./types";

const addDotToSelector = (selector: string): string => "." + selector.trim();

export const getSelectedElements = (
  selectedTags: string,
  include: string,
  exclude: string
): HTMLElement[] => {
  if (selectedTags.length) {
    const parsedTags = Json.read(selectedTags);
    const selected = Arr.readWithItemReader<string>(Str.read)(parsedTags) ?? [];

    const query = (tag: string) => {
      const selectors = include
        .split(",")
        .map(addDotToSelector)
        .filter(isValidSelector);
      const includeQuery = selectors.reduce((acc, curr, i) => {
        const suffix = i !== selectors.length - 1 ? "," : "";

        return acc + `${curr.trim()} ${tag}:not(.brz-toc-title)${suffix}`;
      }, "");

      return includeQuery !== "" && isValidSelector(includeQuery)
        ? includeQuery
        : `${tag}:not(.brz-toc-title)`;
    };
    return selected
      .map((tag) => [
        ...document.querySelectorAll<HTMLElement>(`${query(tag)}`)
      ])
      .flat()
      .filter((node) => {
        const selector = exclude.split(",").map(addDotToSelector).join(",");
        if (selector !== "" && isValidSelector(selector)) {
          return !node.closest(selector);
        }

        return node;
      });
  }

  return [];
};

export const convertMarkerTypeToTag = (markerType: MarkerType): "ul" | "ol" => {
  switch (markerType) {
    case "circle":
      return "ul";
    case "numbers":
      return "ol";
  }
};

export const isStatePatch = (patch: Partial<State>): patch is State =>
  Obj.length(patch) > 0 && Obj.hasSomeKey(["isOpened", "headings"], patch);
