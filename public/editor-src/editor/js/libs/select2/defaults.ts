import { type DropdownConstructor, Dropdown } from "./dropdown/dropdown";
import { withAttachBody } from "./dropdown/attachBody";
import { withCloseOnSelect } from "./dropdown/closeOnSelect";
import { withMinimumResultsForSearch } from "./dropdown/minimumResultsForSearch";
import { withSearch as withDropdownSearch } from "./dropdown/search";
import type { Options } from "./options";
import {
  type ResultsConstructor,
  Results,
  withHiddenPlaceholder
} from "./results";
import type { SelectionConstructor } from "./selection/base";
import { withEventRelay } from "./selection/eventRelay";
import { MultipleSelection } from "./selection/multiple";
import { withPlaceholder } from "./selection/placeholder";
import { withSearch as withSelectionSearch } from "./selection/search";
import { SingleSelection } from "./selection/single";

interface Adapters {
  Results: ResultsConstructor;
  Dropdown: DropdownConstructor;
  Selection: SelectionConstructor;
}

// Which parts a select is built from, decided by its options.
export function adaptersFor(options: Options): Adapters {
  const multiple = Boolean(options.get("multiple"));
  const hasPlaceholder = options.get("placeholder") != null;

  let ResultsAdapter: ResultsConstructor = Results;

  if (hasPlaceholder) {
    ResultsAdapter = withHiddenPlaceholder(ResultsAdapter);
  }

  let DropdownAdapter: DropdownConstructor = multiple
    ? Dropdown
    : withDropdownSearch(Dropdown);

  if (options.get("minimumResultsForSearch") !== 0) {
    DropdownAdapter = withMinimumResultsForSearch(DropdownAdapter);
  }

  if (options.get("closeOnSelect")) {
    DropdownAdapter = withCloseOnSelect(DropdownAdapter);
  }

  DropdownAdapter = withAttachBody(DropdownAdapter);

  let SelectionAdapter: SelectionConstructor = multiple
    ? MultipleSelection
    : SingleSelection;

  if (hasPlaceholder) {
    SelectionAdapter = withPlaceholder(SelectionAdapter);
  }

  if (multiple) {
    SelectionAdapter = withSelectionSearch(SelectionAdapter);
  }

  SelectionAdapter = withEventRelay(SelectionAdapter);

  return {
    Results: ResultsAdapter,
    Dropdown: DropdownAdapter,
    Selection: SelectionAdapter
  };
}
