import { WithClassName, WithOnChange, WithValue } from "../types/attributes";

export type Props = WithClassName & WithValue<string> & WithOnChange<string>;
