import classnames from "classnames";
import React, { useMemo } from "react";
import { CheckGroup as CheckGroupControl } from "visual/component/Controls/CheckGroup";
import { CheckGroupItem } from "visual/component/Controls/CheckGroup/CheckGroupItem";
import EditorIcon from "visual/component/EditorIcon";
import { Choices, Props } from "./types";
import { CheckGroupLabel } from "visual/component/Controls/CheckGroup/CheckGroupLabel";

export const CheckGroup = ({ onChange, config, label }: Props): JSX.Element => {
  const renderLabel = useMemo((): JSX.Element => {
    const _label = label ?? <></>;

    if (config?.helper) {
      return (
        <CheckGroupLabel
          label={_label}
          helperContent={config?.helperContent ?? ""}
        />
      );
    }

    return _label;
  }, [config?.helper, config?.helperContent, label]);

  const choices = useMemo((): JSX.Element[] => {
    if (config && config.choices) {
      return config.choices.map(({ value, title, icon }: Choices) => {
        const className = classnames({
          "brz-ed-option__check-group--boxed": icon
        });

        return (
          <CheckGroupItem
            key={value}
            className={className}
            name={title || icon}
            value={value}
            isEditor
          >
            {icon && (
              <div className="brz-ed-option__check-group__icon">
                <EditorIcon icon={icon} />
              </div>
            )}
            {title && (
              <div className="brz-ed-option__check-group__title">{title}</div>
            )}
          </CheckGroupItem>
        );
      });
    }
    return [];
  }, [config]);

  return (
    <>
      {renderLabel}
      <CheckGroupControl onChange={onChange}>{choices}</CheckGroupControl>
    </>
  );
};
