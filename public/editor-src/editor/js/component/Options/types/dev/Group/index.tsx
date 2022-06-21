import React, { FC } from "react";
import * as Option from "visual/component/Options/Type";
import Options from "visual/component/Options";
import { Group as Control } from "visual/component/Controls/Group";
import { WithClassName } from "visual/utils/options/attributes";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { withOptions } from "visual/component/Options/utils/filters";

export type Props = Option.Props<undefined> &
  WithClassName & {
    options: ToolbarItemType[];
  };

export const Group: FC<Props> &
  Option.OptionType<undefined> &
  Option.SelfFilter<"group-dev"> = ({ className, options, toolbar }) => {
  return (
    <Control className={className}>
      <Options wrapOptions={false} data={options} toolbar={toolbar} />
    </Control>
  );
};

const getModel: Option.FromElementModel<undefined> = () => undefined;

const getElementModel: Option.ToElementModel<undefined> = () => ({});

Group.fromElementModel = getModel;

Group.toElementModel = getElementModel;

// @ts-expect-error: Variable 'defaultValue' implicitly has an 'any' type.
Group.defaultValue = undefined;

Group.filter = withOptions;

Group.reduce = (fn, t0, item) => item.options?.reduce(fn, t0) ?? t0;

Group.map = (fn, item) => ({ ...item, options: item.options?.map(fn) });
