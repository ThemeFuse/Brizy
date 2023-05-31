import { langs } from "@uiw/codemirror-extensions-langs";
import Code from "@uiw/react-codemirror";
import classNames from "classnames";
import React, { FC, ReactElement, useMemo } from "react";
import { useTheme } from "./themes/useTheme";
import { Props } from "./types";

export const CodeMirror: FC<Props> = ({
  className,
  value,
  placeholder,
  theme = "default",
  size,
  language,
  onChange
}): ReactElement => {
  const langExtension = useMemo(() => langs[language], [language]);

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
      extensions={[langExtension()]}
    />
  );
};
