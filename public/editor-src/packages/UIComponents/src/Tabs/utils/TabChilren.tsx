import React, { ReactElement } from "react";
import { Button } from "../../Button";
import { IconsName } from "../../EditorIcon/types";
import { Tab } from "../components/Tab";
import { TabProps } from "../types";

interface ChildrenProps {
  tab: TabProps<string> & { key: string };
  options: ReactElement[];
}

const options = {
  left: [
    <Button key="1" icon={IconsName["t2-group-slider"]} reverse reverseTheme>
      Button Tab
    </Button>,
    <Button key="2" icon={IconsName["t2-event-calendar"]} reverse reverseTheme>
      Button Tab
    </Button>
  ],
  right: [
    <Button key="1" icon={IconsName.Duplicate} reverse reverseTheme>
      Icon Tab
    </Button>
  ]
};

// this is used in docs and tests as Tabs children
export const tabChildrenTop: ChildrenProps[] = [
  {
    tab: {
      value: "currentShortcodeTab",
      key: "currentShortcodeTab",
      label: "Button"
    },
    options: options.left
  },
  {
    tab: {
      value: "currentShortcodeIconTab",
      key: "currentShortcodeIconTab",
      label: "Icon"
    },
    options: options.right
  }
];

export const tabChildrenSide: ChildrenProps[] = [
  {
    tab: {
      value: "currentShortcodeTab",
      key: "currentShortcodeTab",
      icon: IconsName["t2-event-calendar"]
    },
    options: options.left
  },
  {
    tab: {
      value: "currentShortcodeIconTab",
      key: "currentShortcodeIconTab",
      icon: IconsName.Duplicate
    },
    options: options.right
  }
];

export const tabChildrenSingle: ChildrenProps[] = [
  {
    tab: {
      value: "currentShortcodeTab",
      key: "currentShortcodeTab",
      label: "Button"
    },
    options: options.left
  }
];

export const tabChildrenMap = (tabChildren: ChildrenProps[]) => {
  return tabChildren.map((children) => {
    const { tab, options } = children;
    return (
      <Tab
        value={tab.value}
        label={tab.label}
        key={tab.value}
        icon={tab.icon}
        title={tab.title}
      >
        {options}
      </Tab>
    );
  });
};
