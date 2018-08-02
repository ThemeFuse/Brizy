import React from "react";

export default class DataFilter extends React.Component {
  state = {
    currentFilter: this.props.defaultFilter
  };

  setFilter = patch => {
    this.setState(state => ({
      currentFilter: { ...state.currentFilter, ...patch }
    }));
  };

  render() {
    const { filterFn, data, children } = this.props;
    const { currentFilter } = this.state;
    const filteredData = data.filter(item => filterFn(item, currentFilter));

    return children(filteredData, currentFilter, this.setFilter);
  }
}
