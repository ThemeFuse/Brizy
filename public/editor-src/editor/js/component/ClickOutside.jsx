import React from "react";
import ReactDOM from "react-dom";
import jQuery from "jquery";

let instances = [];

export default class ClickOutside extends React.Component {
  static defaultProps = {
    exceptions: []
  };

  componentDidMount() {
    // we add just one listener for all instances
    // because otherwise we would end up with tens of
    // listeners on the document
    // (and it's a little faster when adding just one)
    if (instances.length === 0) {
      document.addEventListener("mousedown", this.handleAll, true);
      window.parent.document.addEventListener(
        "mousedown",
        this.handleAll,
        true
      );
    }
    instances.push(this);
  }

  componentWillUnmount() {
    instances.splice(instances.indexOf(this), 1);
    if (instances.length === 0) {
      document.removeEventListener("mousedown", this.handleAll, true);
      window.parent.document.removeEventListener(
        "mousedown",
        this.handleAll,
        true
      );
    }
  }

  handleAll = e => {
    instances.forEach(instance => {
      const { exceptions, onClickOutside } = instance.props;
      let exceptionsCount = 0;

      if (exceptions.length > 0) {
        const { functionExceptions, stringExceptions } = exceptions.reduce(
          (acc, exception) => {
            switch (typeof exception) {
              case "function":
                acc.functionExceptions.push(exception);
                break;
              case "string":
                acc.stringExceptions.push(exception);
                break;
            }

            return acc;
          },
          { functionExceptions: [], stringExceptions: [] }
        );

        if (functionExceptions.length > 0) {
          exceptionsCount += functionExceptions.filter(
            exception => exception(e.target) === true
          ).length;
        }

        if (exceptionsCount === 0 && stringExceptions.length > 0) {
          exceptionsCount += jQuery(e.target).closest(
            stringExceptions.join(",")
          ).length;
        }
      }

      if (exceptionsCount === 0) {
        const node = ReactDOM.findDOMNode(instance);

        if (node && !node.contains(e.target)) {
          onClickOutside(e);
        }
      }
    });
  };

  render() {
    return React.Children.only(this.props.children);
  }
}
