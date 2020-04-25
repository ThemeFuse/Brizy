import { ApiConnect, Account, Client, Fields, List, Done } from "../Step";
import { BaseApp } from "../../common/GlobalApps/BaseApp";

class CampaignMonitor extends BaseApp {
  static connect = ApiConnect;
  static account = Account;
  static client = Client;
  static fields = Fields;
  static list = List;
  static done = Done;
}

export default CampaignMonitor;
