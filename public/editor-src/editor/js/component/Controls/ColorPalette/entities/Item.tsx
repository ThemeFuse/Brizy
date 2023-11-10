import classNames from "classnames";
import React, { VFC, useCallback, useMemo } from "react";

type Props = {
  id: string;
  hex: string;
  value: string;
  onChange: (id: string) => void;
};

export const ColorPaletteItem: VFC<Props> = ({ id, hex, value, onChange }) => {
  const className = classNames("brz-ed-control__color-palette__item", {
    active: id === value
  });

  const style = useMemo(() => ({ backgroundColor: hex }), [hex]);
  const cb = useCallback(() => onChange(id), [id, onChange]);

  return <div key={id} className={className} style={style} onClick={cb} />;
};
