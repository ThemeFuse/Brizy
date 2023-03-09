import React, { ChangeEvent } from "react";
import _ from "underscore";
import { IProps, IState } from "./types";
import {
  correctNumber,
  formatInputValue,
  preciseAdd,
  preciseSub
} from "./utils";

const DEBOUNCE_WAIT = 1000;

export class AutoCorrectingInput extends React.Component<IProps, IState> {
  static defaultProps = {
    className: "",
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    round: true,
    onFocus: _.noop,
    onBlur: _.noop,
    onTextChange: _.noop,
    onChange: _.noop,
    onMouseEnter: _.noop,
    onMouseLeave: _.noop
  };

  state = {
    text: formatInputValue(this.props.value, this.props.step),
    value: this.props.value,
    prevPropsValue: this.props.value
  };

  static getDerivedStateFromProps(props: IProps, state: IState) {
    if (props.value !== state.prevPropsValue) {
      return {
        text: formatInputValue(props.value, props.step),
        value: props.value,
        prevPropsValue: props.value
      };
    }

    return null;
  }

  componentWillUnmount() {
    this.debouncedOnChange.cancel();
  }

  increment() {
    this.setState(
      (state: IState, props) => {
        const { min, max, step } = props;
        const { text, value } = state;
        const textValue = Number(text);
        const correctedAndIncrementedTextValue = correctNumber(
          preciseAdd(textValue, step),
          min,
          max,
          step
        );

        if (correctedAndIncrementedTextValue !== value) {
          return {
            text: formatInputValue(correctedAndIncrementedTextValue, step),
            value: correctedAndIncrementedTextValue
          };
        }

        return null;
      },
      () => {
        if (this.props.onTextChange) this.props.onTextChange(this.state.text);
        this.props.onChange(this.state.value);
      }
    );
  }

  decrement() {
    this.setState(
      (state: IState, props) => {
        const { min, max, step } = props;
        const { text, value } = state;
        const textValue = Number(text);
        const correctedAndDecrementedTextValue = correctNumber(
          preciseSub(textValue, step),
          min,
          max,
          step
        );

        if (correctedAndDecrementedTextValue !== value) {
          return {
            text: formatInputValue(correctedAndDecrementedTextValue, step),
            value: correctedAndDecrementedTextValue
          };
        }

        return null;
      },
      () => {
        if (this.props.onTextChange) this.props.onTextChange(this.state.text);
        this.props.onChange(this.state.value);
      }
    );
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ text: e.target.value }, () => {
      if (this.props.onTextChange) this.props.onTextChange(this.state.text);
      this.debouncedOnChange();
    });
  };

  debouncedOnChange = _.debounce(() => {
    this.setState(
      (state: IState, props) => {
        const { min, max, step } = props;
        const { text, value } = state;
        const textValue = parseFloat(String(text));
        const correctedTextValue = correctNumber(
          !Number.isNaN(textValue) ? textValue : value,
          min,
          max,
          step
        );

        return {
          text: formatInputValue(correctedTextValue, step),
          value: correctedTextValue
        };
      },
      () => {
        if (this.props.onTextChange) this.props.onTextChange(this.state.text);
        this.props.onChange(this.state.value);
      }
    );
  }, DEBOUNCE_WAIT);
  render() {
    const {
      className,
      min,
      max,
      step,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      size
    } = this.props;
    const { text } = this.state;

    return (
      <input
        className={className}
        type="number"
        value={text}
        min={min}
        max={max}
        step={step}
        size={size}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={this.handleChange}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );
  }
}
