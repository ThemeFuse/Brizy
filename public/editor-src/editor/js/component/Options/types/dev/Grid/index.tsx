import React, { FC, useMemo } from "react";
import * as Option from "visual/component/Options/Type";
import Options from "visual/component/Options";
import { Grid as Control } from "visual/component/Controls/Grid";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { Column } from "visual/component/Controls/Grid/Column";
import { Column as ColumnType, Config } from "./types";
import { withColumns } from "visual/component/Options/utils/filters";

export interface Props
  extends Option.Props<undefined>,
    WithClassName,
    WithConfig<Config> {
  columns?: ColumnType[];
}

export const Grid: FC<Props> &
  Option.OptionType<undefined> &
  Option.SelfFilter<"grid-dev"> = ({ className, columns, toolbar, config }) => {
  const grid = useMemo(() => columns?.map(c => c.size ?? "auto") ?? [], [
    columns
  ]);

  return columns ? (
    <Control
      className={className}
      grid={grid}
      separator={config?.separator ?? false}
    >
      {columns.map((col, k) => (
        <Column key={k} align={col.align ?? "start"}>
          <Options wrapOptions={false} data={col.options} toolbar={toolbar} />
        </Column>
      ))}
    </Control>
  ) : null;
};

const getModel: Option.FromElementModel<undefined> = () => undefined;

const getElementModel: Option.ToElementModel<undefined> = () => ({});

Grid.fromElementModel = getModel;

Grid.toElementModel = getElementModel;

// @ts-expect-error: Variable 'defaultValue' implicitly has an 'any' type.
Grid.defaultValue = undefined;

Grid.filter = withColumns;

Grid.reduce = (fn, t0, item) => {
  return (
    item.columns?.reduce(
      (acc, column) => column.options?.reduce(fn, acc) ?? t0,
      t0
    ) ?? t0
  );
};

Grid.map = (fn, item) => ({
  ...item,
  columns: item.columns?.map(column => ({
    ...column,
    options: column.options?.map(fn)
  }))
});
