import React, { FC, useMemo } from "react";
import { Grid as Control } from "visual/component/Controls/Grid";
import { Column } from "visual/component/Controls/Grid/Column";
import Options from "visual/component/Options";
import { Props as OptionProps } from "visual/component/Options/Type";
import { WithClassName, WithConfig } from "visual/utils/options/attributes";
import { Column as ColumnType, Config } from "./types";

export interface Props
  extends OptionProps<undefined>,
    WithClassName,
    WithConfig<Config> {
  columns?: ColumnType[];
}

export const Grid: FC<Props> = ({ className, columns, toolbar, config }) => {
  const grid = useMemo(
    () => columns?.map((c) => c.size ?? "auto") ?? [],
    [columns]
  );

  return columns ? (
    <Control
      className={className}
      grid={grid}
      separator={config?.separator ?? false}
    >
      {columns.map((col, k) => (
        <Column className={col.className} key={k} align={col.align ?? "start"}>
          <Options wrapOptions={false} data={col.options} toolbar={toolbar} />
        </Column>
      ))}
    </Control>
  ) : null;
};
