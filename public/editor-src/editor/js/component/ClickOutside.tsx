import jQuery from "jquery";
import React from "react";
import ReactDOM from "react-dom";

type FunctionalException = (el: HTMLElement) => boolean;

type Exception = string | FunctionalException;

type Acc = {
  functionExceptions: FunctionalException[];
  stringExceptions: string[];
};

interface Props {
  exceptions: Exception[];
  onClickOutside: (e: MouseEvent) => void;
}

const instances: ClickOutside[] = [];

export default class ClickOutside extends React.Component<Props> {
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

  handleAll = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    instances.forEach((instance) => {
      const { exceptions, onClickOutside } = instance.props;
      let exceptionsCount = 0;

      if (exceptions.length > 0) {
        const { functionExceptions, stringExceptions } = exceptions.reduce(
          (acc: Acc, exception: Exception) => {
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
            (exception) => exception(el) === true
          ).length;
        }

        if (exceptionsCount === 0 && stringExceptions.length > 0) {
          exceptionsCount += jQuery(el).closest(
            stringExceptions.join(",")
          ).length;
        }
      }

      if (exceptionsCount === 0) {
        // eslint-disable-next-line react/no-find-dom-node
        const node = ReactDOM.findDOMNode(instance);

        if (node && !node.contains(el)) {
          onClickOutside(e);
        }
      }
    });
  };

  render() {
    return React.Children.only(this.props.children);
  }
}
