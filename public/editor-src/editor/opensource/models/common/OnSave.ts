import { HtmlOutputType } from ".";
import { Output } from "./Output";

export type OnSave<T extends HtmlOutputType> = (output: Output<T>) => void;
