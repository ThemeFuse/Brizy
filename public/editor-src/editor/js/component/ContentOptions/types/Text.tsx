import React from "react";
import _ from "underscore";
import classnames from "classnames";
import { TextEditor } from "visual/component/Controls/TextEditor";
import * as str from "visual/utils/reader/string";
import { hasDC } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { V } from "visual/types";

type Props = {
  id: string;
  v: V;
  tagName?: keyof JSX.IntrinsicElements;
  className?: string;

  // optional onChange makes sense for components that only
  // display dynamic content (like PostTitle)
  onChange?: (value: { [k: string]: string }) => void;
};

export const Text: React.FC<Props> = ({
  id,
  v,
  tagName = "span",
  className: className_,
  onChange = _.noop
}) => {
  const className = classnames(className_, `brz-${tagName}`);
  const hasDC_ = hasDC(v, id);

  return hasDC_ ? (
    React.createElement(tagName, {
      className,

      // WordPress can send contents with encoded html entities
      // (e.g. Brizy&#8217;s Dynamic Content)
      // making us resort for dangerouslySetInnerHTML for now
      dangerouslySetInnerHTML: { __html: v[id] || "" }
    })
  ) : (
    <TextEditor
      className={className_} // TextEditor puts brz-${tagName} class itself
      tagName={tagName}
      value={str.read(v[id])}
      onChange={(value: string): void => onChange({ [id]: value })}
    />
  );
};
