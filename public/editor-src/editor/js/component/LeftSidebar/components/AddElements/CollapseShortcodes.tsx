import { JSX, useState } from "react";

export const CollapseShortcodes = ({
  children
}: {
  children: ({
    setOpen,
    open
  }: {
    setOpen: (s: boolean) => void;
    open: boolean;
  }) => JSX.Element;
}) => {
  const [open, setOpen] = useState(true);

  return children({ setOpen, open });
};
