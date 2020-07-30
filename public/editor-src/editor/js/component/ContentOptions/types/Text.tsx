import React from "react";
import _ from "underscore";
import classnames from "classnames";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { useDynamicContent } from "visual/component/DynamicContent/useDynamicContent";

type Props = {
  id: string;
  v: { [k: string]: string };
  tagName?: keyof JSX.IntrinsicElements;
  className?: string;

  // optional onChange makes sense for components that only
  // display dynamic content (like PostTitle)
  onChange?: (value: { [k: string]: string }) => void;
};

export const Text: React.FC<Props> = props => {
  return TARGET === "WP" ? <TextWithDC {...props} /> : <TextNoDC {...props} />;
};

export const TextWithDC: React.FC<Props> = ({
  id,
  v,
  tagName = "span",
  className: className_,
  onChange = _.noop
}) => {
  const value = v[id] ?? "";
  const dcValue = v[`${id}Population`] ?? "";
  const dcFallback = "";

  const { status, data, error } = useDynamicContent(dcValue);
  const className = classnames(className_, `brz-${tagName}`);

  switch (status) {
    case "empty":
      return (
        <TextEditor
          // TextEditor puts brz-${tagName} class itself
          className={className_}
          tagName={tagName}
          value={value}
          onChange={(value: string): void => onChange({ [id]: value })}
        />
      );
    case "idle":
    case "waiting":
      return React.createElement(tagName, { className }, dcValue);
    case "success":
      return React.createElement(tagName, {
        className,

        // WordPress can send contents with encoded html entities
        // (e.g. Brizy&#8217;s Dynamic Content)
        // making us resort for dangerouslySetInnerHTML for now
        dangerouslySetInnerHTML: { __html: data || dcFallback }
      });

    // not sure yet what to do here
    case "failed":
      if (process.env.NODE_ENV === "development") {
        console.error(error);
      }
      return React.createElement(tagName, { className }, dcValue);
  }
};

export const TextNoDC: React.FC<Props> = ({
  id,
  v,
  tagName = "span",
  className,
  onChange = _.noop
}) => {
  const value = v[id] ?? "";

  return (
    <TextEditor
      className={className}
      tagName={tagName}
      value={value}
      onChange={(value: string): void => onChange({ [id]: value })}
    />
  );
};
