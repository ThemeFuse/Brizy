import { PropsWithChildren, ReactElement, ReactNode } from "react";
import { ContentProps } from "../Tooltip/types";
import { WithClassName } from "../types/attributes";

export type Props = WithClassName &
  PropsWithChildren<ReactNode | unknown> & {
    toolbar?: ContentProps["toolbar"];
    trigger: ReactElement;
    onOpen?: () => void;
    onClose?: () => void;
    title?: string;
    size: "small" | "medium" | "large" | "xlarge" | "auto";
    clickOutsideExceptions?: string[];
    placement: ContentProps["placement"];
  };
