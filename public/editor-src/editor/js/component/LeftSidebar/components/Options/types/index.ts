import Button from "./Button";
import Custom from "./Custom";
import DrawerIcon from "./DrawerIcon";
import { Languages } from "./Languages";
import Link from "./Link";
import Popover from "./Popover";
import { Roles } from "./Roles";
import Template from "./Template";

const OptionTypes = {
  button: Button,
  link: Link,
  popover: Popover,
  drawer: DrawerIcon,
  custom: Custom,
  membership: Roles,
  template: Template,
  language: Languages,
  shortcuts: Link
};

export default OptionTypes;
