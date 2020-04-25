import Connect from "./Connect";
import Disconnect from "../../Step/Disconnect";
import Done from "../../Step/Done";
import { BaseApp } from "../../../common/GlobalApps/BaseApp";

class Facebook extends BaseApp {
  static connect = Connect;
  static disconnect = Disconnect;
  static done = Done;
}

export default Facebook;
