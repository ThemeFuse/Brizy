import { BaseApp } from "../../../common/GlobalApps/BaseApp";
import Disconnect from "../../Step/Disconnect";
import Done from "../../Step/Done";
import Connect from "./Connect";

class Facebook extends BaseApp {
  static connect = Connect;
  static disconnect = Disconnect;
  static done = Done;
}

export default Facebook;
