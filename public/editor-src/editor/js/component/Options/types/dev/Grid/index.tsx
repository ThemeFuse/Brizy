import React, { type ReactElement, useMemo } from "react";
import { Grid as Control } from "visual/component/Controls/Grid";
import { Column } from "visual/component/Controls/Grid/Column";
import Options from "visual/component/Options";
import type { Props as OptionProps } from "visual/component/Options/Type";
import { usePro } from "visual/global/hooks";
import { useConfig } from "visual/providers/ConfigProvider";
import type { WithClassName, WithConfig } from "visual/types/attributes";
import type { Column as ColumnType, Config } from "./types";

export interface Props
  extends OptionProps<undefined>,
    WithClassName,
    WithConfig<Config> {
  columns?: ColumnType[];
}

export const Grid = ({
  className,
  columns,
  toolbar,
  config
}: Props): ReactElement | null => {
  const grid = useMemo(
    () => columns?.map((c) => c.size ?? "auto") ?? [],
    [columns]
  );

  const cnfg = useConfig();

  const pro = usePro();

  return columns ? (
    <Control
      className={className}
      grid={grid}
      separator={config?.separator ?? false}
    >
      {columns.map((col, k) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: columns are a fixed layout definition with no id; position is the identity
        <Column className={col.className} key={k} align={col.align ?? "start"}>
          <Options
            wrapOptions={false}
            data={col.options}
            toolbar={toolbar}
            isPro={pro}
            upgradeToPro={cnfg?.urls?.upgradeToPro}
          />
        </Column>
      ))}
    </Control>
  ) : null;
};
