import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { GoogleConnect } from "../Step";
import Done from "../Step/Done";

class Google extends BaseApp {
  static connect = GoogleConnect;
  static done = Done;
}

export default Google;
