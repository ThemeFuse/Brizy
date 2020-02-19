import React, { Component } from "react";
import classNames from "classnames";
import {
  WithClassName,
  WithOnChange,
  WithPlaceholder,
  WithValue
} from "visual/utils/options/attributes";
import { SimpleValue } from "visual/component/Options/Type";

const Code = IS_EDITOR ? require("react-codemirror") : undefined;

export type Props = WithClassName &
  WithValue<string> &
  WithOnChange<string> &
  WithPlaceholder & {
    language: string;
  };

export class CodeMirror extends Component<Props, SimpleValue<string>> {
  constructor(props: Props) {
    super(props);

    this.state = { value: props.value };

    if (IS_EDITOR) {
      require("codemirror/addon/display/placeholder");
      require(`codemirror/mode/${props.language}/${props.language}`);
    }
  }

  onChange = (value: string): void => this.setState({ value }, this.update);

  update = (): void => this.props.onChange(this.state.value);

  componentDidUpdate(prevProps: Readonly<Props>): void {
    const lg = this.props.language;

    if (IS_EDITOR && prevProps.language !== lg) {
      require(`codemirror/mode/${lg}/${lg}`);
    }
  }

  render(): React.ReactElement {
    return (
      Code && (
        <Code
          className={classNames(
            "brz-ed-control__codeMirror",
            this.props.className
          )}
          value={this.state.value}
          onChange={this.onChange}
          options={{
            tabSize: 2,
            placeholder: this.props.placeholder,
            mode: this.props.language
          }}
        />
      )
    );
  }
}
