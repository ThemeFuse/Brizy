import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { Done, EmailFields } from "../Step";

class Wordpress extends BaseApp {
  static fields = EmailFields;
  static done = Done;
}

export default Wordpress;
