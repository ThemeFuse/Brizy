import { BaseApp } from "../../common/GlobalApps/BaseApp";
import Connect from "../Step/GoogleConnect";
import Done from "../Step/Done";

class Google extends BaseApp {
  static connect = Connect;
  static done = Done;
}

export default Google;
