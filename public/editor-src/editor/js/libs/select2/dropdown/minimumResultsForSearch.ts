import type { DataItem } from "../types";
import type { DropdownConstructor, SearchParams } from "./dropdown";

function countResults(data: DataItem[]): number {
  let count = 0;

  for (const item of data) {
    if (item.children) {
      count += countResults(item.children);
    } else {
      count++;
    }
  }

  return count;
}

// Hides the search field of the dropdown while there are too few results to search.
export function withMinimumResultsForSearch(
  Base: DropdownConstructor
): DropdownConstructor {
  return class extends Base {
    showSearch(params: SearchParams): boolean {
      const option = Number(this.options.get("minimumResultsForSearch"));
      const minimum = option < 0 ? Number.POSITIVE_INFINITY : option;

      if (countResults(params.data.results) < minimum) {
        return false;
      }

      return super.showSearch(params);
    }
  };
}
