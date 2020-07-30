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
    language: "htmlmixed" | "css" | "javascript" | "markdown" | "xml";
    theme?: "default" | "idea";
  };

export class CodeMirror extends Component<Props, SimpleValue<string>> {
  constructor(props: Props) {
    super(props);

    if (IS_EDITOR) {
      require("codemirror/addon/display/placeholder");
      require(`codemirror/mode/${props.language}/${props.language}`);
    }
  }

  onChange = (value: string): void => this.props.onChange(value);

  componentDidUpdate(prevProps: Readonly<Props>): void {
    const lg = this.props.language;

    if (IS_EDITOR && prevProps.language !== lg) {
      require(`codemirror/mode/${lg}/${lg}`);
    }
  }

  render(): React.ReactElement {
    const {
      className,
      value,
      placeholder,
      language,
      theme = "default"
    } = this.props;

    return (
      Code && (
        <Code
          className={classNames("brz-ed-control__codeMirror", className)}
          value={value}
          onChange={this.onChange}
          options={{
            placeholder,
            theme,
            tabSize: 2,
            mode: language
          }}
        />
      )
    );
  }
}
