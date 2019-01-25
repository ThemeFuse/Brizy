import { ApiConnect, Account, Client, Fields, List, Done } from "../Step";

class CampaignMonitor {
  static connect = ApiConnect;
  static account = Account;
  static client = Client;
  static fields = Fields;
  static list = List;
  static done = Done;
}

export default CampaignMonitor;
