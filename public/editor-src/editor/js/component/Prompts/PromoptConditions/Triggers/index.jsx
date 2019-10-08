import React from "react";
import { connect } from "react-redux";
import { triggersSelector } from "visual/redux/selectors";
import { updateTriggers } from "visual/redux/actions";

import items from "./items";
import Lists from "../common/Lists";

class Triggers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  handleChange = values => {
    this.setState({ loading: true }, () => {
      const meta = {
        syncSuccess: () =>
          this.setState({
            loading: false
          }),
        syncFail: () =>
          this.setState({
            loading: false
          })
      };

      this.props.dispatch(updateTriggers(values, meta));
    });
  };

  render() {
    return (
      <Lists
        showTypeButton={false}
        items={items}
        values={this.props.values}
        loading={this.state.loading}
        onChange={this.handleChange}
        onClose={this.props.onClose}
      />
    );
  }
}

const stateToProps = state => ({ values: triggersSelector(state) });

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(
  stateToProps,
  mapDispatchToProps
)(Triggers);
