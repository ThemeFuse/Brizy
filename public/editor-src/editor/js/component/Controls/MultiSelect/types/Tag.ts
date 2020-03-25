import { PropsWithChildren, ReactElement } from "react";

export type TagProps = PropsWithChildren<{ onRemove: () => void }>;

export type TagInstance = ReactElement<TagProps>;
