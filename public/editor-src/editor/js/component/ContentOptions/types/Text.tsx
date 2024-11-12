import classnames from "classnames";
import React, { ReactElement } from "react";
import _ from "underscore";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { Translate } from "visual/component/Translate";
import { hasDC } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { V } from "visual/types";
import * as str from "visual/utils/reader/string";

type Props = {
  id: string;
  v: V;
  tagName?: keyof JSX.IntrinsicElements;
  className?: string;
  allowLineBreak?: boolean;

  // optional onChange makes sense for components that only
  // display dynamic content (like PostTitle)
  onChange?: (value: { [k: string]: string }) => void;
};

export const Text = ({
  id,
  v,
  tagName = "span",
  className: className_,
  allowLineBreak,
  onChange = _.noop
}: Props): ReactElement => {
  const className = classnames(className_, `brz-${tagName}`);
  const hasDC_ = hasDC(v, id);

  return hasDC_ ? (
    <Translate
      tagName={tagName}
      className={className}
      dangerouslySetInnerHTML={{ __html: v[id] || "" }}
      // WordPress can send contents with encoded html entities
      // (e.g. Brizy&#8217;s Dynamic Content)
      // making us resort for dangerouslySetInnerHTML for now
    />
  ) : (
    <TextEditor
      className={className_} // TextEditor puts brz-${tagName} class itself
      tagName={tagName}
      value={str.read(v[id])}
      onChange={(value: string): void => onChange({ [id]: value })}
      allowLineBreak={allowLineBreak}
    />
  );
};
