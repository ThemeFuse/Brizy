import { FC, PropsWithChildren } from "react";

// Custom Type for a React functional component with props AND CHILDREN
export type FCC<P = NonNullable<unknown>> = FC<PropsWithChildren<P>>;

export type FCP<P, R> = (p: P) => R;
