import classnames from "classnames";
import React, { CSSProperties, useMemo } from "react";
import { Text } from "visual/component/ContentOptions/types";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { ViewType } from "visual/editorComponents/Form2/Form2Steps/types";
import { RenderType, isEditor } from "visual/providers/RenderProvider";
import { FCC } from "visual/utils/react/types";
import type { Value } from "../types";

interface Props {
  v: Value;
  active: boolean;
  viewType: ViewType;
  progressStyle: CSSProperties;
  progressValue: string;
  order: number;
  onActiveChange: VoidFunction;
  onChange: (d: Partial<Value>) => void;
  renderContext: RenderType;
}

export const Nav: FCC<Props> = ({
  v,
  active,
  viewType,
  progressStyle,
  progressValue,
  order,
  onActiveChange,
  onChange,
  renderContext
}) => {
  const { iconName, iconType } = useMemo(
    () => ({ iconName: v.iconName, iconType: v.iconType }),
    [v]
  );

  const { isText, isIcon, isNumber, isProgress, isNumberText, isIconText } =
    useMemo(
      () => ({
        isText: viewType === ViewType.Text,
        isIcon: viewType === ViewType.Icon,
        isNumber: viewType === ViewType.Number,
        isProgress: viewType === ViewType.Progress,
        isNumberText: viewType === ViewType.NumberText,
        isIconText: viewType === ViewType.IconText
      }),
      [viewType]
    );

  const className = classnames(
    "brz-form-ms-indicator",
    { "brz-form-ms-progress": isProgress },
    { "brz-form-ms-indicator__active": active }
  );

  return (
    <div className={className} onClick={onActiveChange}>
      {isText && (
        <span className="brz-form-ms-indicator-text">
          <Text id="text" v={v} onChange={onChange} />
        </span>
      )}
      {(isNumber || isNumberText) && (
        <span className="brz-form-ms-indicator-number">{order}</span>
      )}
      {(isIcon || isIconText) && (
        <span className="brz-form-ms-indicator-icon">
          <ThemeIcon name={iconName} type={iconType} />
        </span>
      )}
      {(isNumberText || isIconText) && (
        <span className="brz-form-ms-indicator-text-under">
          <Text id="name" v={v} onChange={onChange} />
        </span>
      )}
      {isProgress && (
        <>
          <span className="brz-form-ms-progress-bar" style={progressStyle} />
          <span
            className={classnames("brz-form-ms-progress-bar-text", {
              "brz-d-none": isEditor(renderContext) && !active
            })}
          >
            {progressValue}
          </span>
        </>
      )}
    </div>
  );
};
