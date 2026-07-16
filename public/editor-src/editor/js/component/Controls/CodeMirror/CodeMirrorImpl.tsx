import Code from "@uiw/react-codemirror";
import classNames from "classnames";
import React, { ReactElement, useMemo } from "react";
import { getLangExtension } from "./langs";
import { useTheme } from "./themes/useTheme";
import { Props } from "./types";

const CodeMirrorImpl = ({
  className,
  value,
  placeholder,
  theme = "default",
  size,
  language,
  onChange
}: Props): ReactElement => {
  const langExtension = useMemo(() => getLangExtension(language), [language]);

  const { themePreset } = useTheme(theme);

  const _className = classNames(
    "cm-wrapper",
    `brz-ed-control__codeMirror--${size}`,
    className
  );

  return (
    <Code
      className={_className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      theme={themePreset()}
      basicSetup={{
        lineNumbers: false,
        autocompletion: false,
        tabSize: 2,
        foldGutter: false
      }}
      extensions={[langExtension]}
    />
  );
};

export default CodeMirrorImpl;
