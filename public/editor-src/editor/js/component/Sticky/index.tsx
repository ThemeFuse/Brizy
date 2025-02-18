import React, { ReactElement } from "react";
import { observer } from "./utils";

const getElement = (selector: string): HTMLElement | null => {
  try {
    return document.querySelector(selector);
  } catch {
    try {
      const _selector = selector.startsWith("#") ? selector.slice(1) : selector;
      return document.getElementById(_selector);
    } catch {
      return null;
    }
  }
};

export interface Props {
  refSelector: string;
  type: "animated" | "fixed";
  render: (f: boolean) => ReactElement;
  onChange: (f: boolean) => void;
}

export default class Sticky extends React.Component<Props> {
  static defaultProps: Props = {
    refSelector: "",
    type: "animated", // animated | fixed
    render: () => <div />,
    onChange: () => null
  };

  state = {
    isSticky: false
  };

  refNode: HTMLElement | null = null;

  componentDidMount(): void {
    observer.addListener(this.checkSticky);
    this.checkSticky();
  }

  componentWillUnmount(): void {
    this.refNode = null;
    observer.removeListener(this.checkSticky);
  }

  handleChange = (): void => {
    this.props.onChange(this.state.isSticky);
  };

  checkSticky = (): void => {
    const { refSelector, type } = this.props;

    if (!this.refNode) {
      this.refNode = getElement(refSelector);
    }

    const refNodeRect = this.refNode?.getBoundingClientRect() ?? {
      top: 0,
      height: 0
    };
    const isSticky =
      type === "animated"
        ? -refNodeRect.top >= refNodeRect.height
        : refNodeRect.top <= 0;

    if (isSticky !== this.state.isSticky) {
      this.setState({ isSticky }, this.handleChange);
    }
  };

  render(): ReactElement {
    return this.props.render(this.state.isSticky);
  }
}
