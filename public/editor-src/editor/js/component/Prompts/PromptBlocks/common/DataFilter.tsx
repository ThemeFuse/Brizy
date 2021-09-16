import React, { ReactElement } from "react";

export interface Props<T, F> {
  defaultFilter: F;
  data: T[];
  filterFn: (i: T, f: F) => boolean;
  children: (i: T[], f: F, ff: (p: Partial<F>) => void) => ReactElement;
}

interface State<T, F> {
  currentFilter: Props<T, F>["defaultFilter"];
}

export default class DataFilter<T, F> extends React.Component<
  Props<T, F>,
  State<T, F>
> {
  state = {
    currentFilter: this.props.defaultFilter
  };

  setFilter = (patch: Partial<F>): void => {
    this.setState(state => ({
      currentFilter: { ...state.currentFilter, ...patch }
    }));
  };

  render(): ReactElement {
    const { filterFn, data, children } = this.props;
    const { currentFilter } = this.state;
    const filteredData = data.filter(item => filterFn(item, currentFilter));

    return children(filteredData, currentFilter, this.setFilter);
  }
}
