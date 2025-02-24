import { Component as ReactComponent } from "react";
import {
  ElementModel,
  ElementModelType2
} from "visual/component/Elements/Types";
import {
  ComponentsMeta,
  ContextMenuItem
} from "visual/editorComponents/EditorComponent/types";
import { WithClassName } from "visual/types/attributes";

export enum Network {
  Facebook = "Facebook",
  Twitter = "Twitter",
  Linkedin = "Linkedin",
  Pinterest = "Pinterest",
  Reddit = "Reddit",
  VK = "VK",
  OK = "OK",
  Tumblr = "Tumblr",
  Skype = "Skype",
  Telegram = "Telegram",
  Pocket = "Pocket",
  XING = "XING",
  WhatsApp = "WhatsApp",
  Email = "Email"
}

export enum Color {
  Official = "official",
  Custom = "custom"
}

export enum View {
  IconText = "icon&text",
  Icon = "icon",
  Text = "text"
}

export enum TargetUrl {
  CurrentUrl = "currentUrl",
  CustomUrl = "customUrl"
}

export type Columns = "auto" | "1" | "2" | "3" | "4" | "5" | "6";

export interface Value extends ElementModel {
  value: {
    items: ElementModelType2[];
  };

  itemIndex: number;
  customCSS: string;
}

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export interface ItemValue extends ElementModel {
  network: Network;

  href: string;
  iconType: string;
  iconName: string;
  customLabelText: string;

  color: Color;
  view: View;
  targetUrl: TargetUrl;
}

export interface Component extends ReactComponent {
  getCurrentCopiedElement: () => Value | null;
  copy: (itemIndex: number) => void;
  paste: (itemIndex: number, cb?: VoidFunction) => void;
  pasteStyles: (itemIndex: number) => void;
  cloneItem: (itemIndex: number, toIndex?: number) => void;
  removeItem: (itemIndex: number) => void;
}

export type GetItems = {
  getItems: (v: Value[], component: Component) => ContextMenuItem[];
};
