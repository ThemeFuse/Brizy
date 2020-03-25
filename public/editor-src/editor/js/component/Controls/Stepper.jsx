import React from "react";
import T from "prop-types";
import _ from "underscore";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";
import AutoCorrectingInput from "./AutoCorrectingInput";

export default class Stepper extends React.Component {
  static propTypes = {
    className: T.string,
    min: T.number,
    max: T.number,
    step: T.number,
    value: T.number,
    onChange: T.func
  };

  static defaultProps = {
    className: "",
    min: 0,
    max: 10,
    step: 1,
    value: 1,
    onChange: _.noop
  };

  nodeRef = React.createRef();

  inputRef = React.createRef();

  mounted = false;

  mouseDown = false;

  timeoutId = null;

  intervalId = null;

  componentDidMount() {
    this.mounted = true;
    this.nodeRef.current.ownerDocument.addEventListener(
      "mouseup",
      this.handleDocumentMouseUp
    );
  }

  componentWillUnmount() {
    this.mounted = false;
    this.nodeRef.current.ownerDocument.removeEventListener(
      "mouseup",
      this.handleDocumentMouseUp
    );
    clearTimeout(this.timeoutId);
    clearInterval(this.intervalId);
  }

  handleDocumentMouseUp = () => {
    if (this.mouseDown) {
      this.mouseDown = false;

      clearTimeout(this.timeoutId);
      clearInterval(this.intervalId);
    }
  };

  handleIncrement = () => {
    this.emulateNativeInput(this.handleIncrementCb);
  };

  handleIncrementCb = () => {
    this.inputRef.current.increment();
  };

  handleDecrement = () => {
    this.emulateNativeInput(this.handleDecrementCb);
  };

  handleDecrementCb = () => {
    this.inputRef.current.decrement();
  };

  /*
   * this tries to emulate native browser number input
   * the behavior is that the first number increments / decrements immediately
   * then comes a small delay after which the number increments / decrements very fast
   */
  emulateNativeInput(cb) {
    cb();

    this.mouseDown = true;
    this.timeoutId = setTimeout(() => {
      if (this.mounted && this.mouseDown) {
        this.intervalId = setInterval(() => {
          if (this.mounted && this.mouseDown) {
            cb();
          }
        }, 50);
      }
    }, 400);
  }

  render() {
    const {
      className: _className,
      value,
      min,
      max,
      step,
      onChange
    } = this.props;
    const className = classnames("brz-ed-control__stepper", _className);

    return (
      <div ref={this.nodeRef} className={className}>
        <div className="brz-ed-control__stepper--value">
          <AutoCorrectingInput
            ref={this.inputRef}
            className="brz-input brz-ed-control__input"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
          />
        </div>
        <div className="brz-ed-control__stepper--arrows">
          <div
            className="brz-ed-control__stepper--up"
            onMouseDown={this.handleIncrement}
          >
            <EditorIcon icon="nc-stre-up" />
          </div>
          <div
            className="brz-ed-control__stepper--down"
            onMouseDown={this.handleDecrement}
          >
            <EditorIcon icon="nc-stre-down" />
          </div>
        </div>
      </div>
    );
  }
}
