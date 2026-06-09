import Button from "./Button";
import Custom from "./Custom";
import DrawerIcon from "./DrawerIcon";
import { Languages } from "./Languages";
import Link from "./Link";
import Popover from "./Popover";
import { Roles } from "./Roles";
import TabIcon from "./TabIcon";
import Template from "./Template";

const OptionTypes = {
  button: Button,
  link: Link,
  popover: Popover,
  drawer: DrawerIcon,
  tab: TabIcon,
  custom: Custom,
  membership: Roles,
  template: Template,
  language: Languages,
  shortcuts: Link,
  explorer: Link
};

export default OptionTypes;
