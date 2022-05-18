import React, { ReactElement, useCallback, useEffect, useState } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { FormField } from "../../../common/GlobalApps/type";
import { copyTextToClipboard } from "visual/component/Prompts/common/utils";

export interface Props {
  fields: FormField[];
  descriptions?: string;
}

export const HelperCopy = (props: Props): ReactElement => {
  const { fields, descriptions } = props;
  const [value, setValue] = useState("");

  const handleCopy = useCallback((id: string) => {
    copyTextToClipboard(`{{${id}}}`);
    setValue(id);
  }, []);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setValue("");
    }, 800);

    return (): void => {
      clearTimeout(timeId);
    };
  }, [value]);

  return (
    <div className="brz-helper__copy">
      {descriptions && (
        <p className="brz-p brz-helper__copy-descriptions">{descriptions}</p>
      )}
      {fields.map((field, index) => (
        <p
          key={index}
          title="Click to copy"
          className="brz-p brz-helper__copy--fields"
          onClick={(): void => {
            handleCopy(field.label);
          }}
        >
          <span className="brz-span">{`{{${field.label}}}`}</span>
          <EditorIcon icon="nc-duplicate" />
          {value === field.label && (
            <span className="brz-span brz-ed-animated brz-ed-animated--fadeIn">
              Copied
            </span>
          )}
        </p>
      ))}
    </div>
  );
};
