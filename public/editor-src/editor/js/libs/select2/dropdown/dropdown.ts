import { Observable } from "../observable";
import type { Options } from "../options";
import type { QueryParams, ResultsData, SelectParams } from "../types";

export interface DropdownContainer extends Observable {
  id: string;
  isOpen: () => boolean;
}

export interface SearchParams {
  data: ResultsData;
  query: QueryParams;
}

// The box that holds the results.
export class Dropdown extends Observable {
  protected dropdown: HTMLElement = document.createElement("span");

  constructor(protected options: Options) {
    super();
  }

  render(): HTMLElement {
    const dropdown = document.createElement("span");

    dropdown.className = "select2-dropdown";
    dropdown.innerHTML = '<span class="select2-results"></span>';
    dropdown.setAttribute("dir", String(this.options.get("dir")));

    this.dropdown = dropdown;

    return dropdown;
  }

  bind(_container: DropdownContainer): void {}

  position(_dropdown: HTMLElement, _container: HTMLElement): void {}

  destroy(): void {
    this.dropdown.remove();
  }

  // Whether the search field has a reason to show for these results.
  showSearch(_params: SearchParams): boolean {
    return true;
  }

  protected closeAfter(params: SelectParams): void {
    this.trigger("close", { originalEvent: params.originalEvent });
  }
}

export type DropdownConstructor = new (options: Options) => Dropdown;
