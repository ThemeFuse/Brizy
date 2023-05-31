import classnames from "classnames";
import React from "react";
import { AutoCorrectingInput, AutoCorrectingInputStepper } from "../";
import { EditorIcon } from "../EditorIcon";
import { IconsName } from "../EditorIcon/types";
import { ComponentRef, Props } from "./types";

export class Stepper extends React.Component<Props> {
  nodeRef = React.createRef<HTMLDivElement>();

  inputRef = React.createRef<AutoCorrectingInput & ComponentRef>();

  mounted = false;

  mouseDown = false;

  timeoutId: null | NodeJS.Timeout = null;

  intervalId: null | NodeJS.Timeout = null;

  componentDidMount() {
    this.mounted = true;
    this.nodeRef.current?.ownerDocument.addEventListener(
      "mouseup",
      this.handleDocumentMouseUp
    );
  }

  componentWillUnmount() {
    this.mounted = false;
    this.nodeRef.current?.ownerDocument.removeEventListener(
      "mouseup",
      this.handleDocumentMouseUp
    );
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.intervalId) clearInterval(this.intervalId);
  }

  handleDocumentMouseUp = () => {
    if (this.mouseDown) {
      this.mouseDown = false;

      if (this.timeoutId) clearTimeout(this.timeoutId);
      if (this.intervalId) clearInterval(this.intervalId);
    }
  };

  handleIncrement = () => {
    this.emulateNativeInput(this.handleIncrementCb);
  };

  handleIncrementCb = () => {
    this.inputRef.current?.increment();
  };

  handleDecrement = () => {
    this.emulateNativeInput(this.handleDecrementCb);
  };

  handleDecrementCb = () => {
    this.inputRef.current?.decrement();
  };

  /*
   * this tries to emulate native browser number input
   * the behavior is that the first number increments / decrements immediately
   * then comes a small delay after which the number increments / decrements very fast
   */
  emulateNativeInput(cb: () => void) {
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
          <AutoCorrectingInputStepper
            inputRef={this.inputRef}
            className="brz-input brz-ed-control__input"
            value={value}
            min={min ?? 0}
            max={max ?? 10}
            step={step ?? 1}
            onChange={onChange}
            handleDecrementCb={this.handleDecrementCb}
            stepperSize="auto"
          />
        </div>
        <div className="brz-ed-control__stepper--arrows">
          <div
            className="brz-ed-control__stepper--up"
            onMouseDown={this.handleIncrement}
          >
            <EditorIcon icon={IconsName["nc-stre-up"]} />
          </div>
          <div
            className="brz-ed-control__stepper--down"
            onMouseDown={this.handleDecrement}
          >
            <EditorIcon icon={IconsName["nc-stre-down"]} />
          </div>
        </div>
      </div>
    );
  }
}
