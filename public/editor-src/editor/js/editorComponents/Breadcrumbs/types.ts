import { ElementModel } from "visual/component/Elements/Types";

export interface Value extends ElementModel {
  breadcrumbContent: string;
  customCSS: string;
}

export type Props = Record<string, unknown>;

export interface Breadcrumb {
  title: string;
  href: string;
}
