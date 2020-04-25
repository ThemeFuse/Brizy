import { EmailFields, Done } from "../Step";
import { BaseApp } from "../../common/GlobalApps/BaseApp";

class Wordpress extends BaseApp {
  static fields = EmailFields;
  static done = Done;
}

export default Wordpress;
