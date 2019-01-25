import { ApiConnect, Account, CustomFields, Done } from "../Step";

class Zapier {
  static connect = ApiConnect;
  static account = Account;
  static fields = CustomFields;
  static done = Done;
}

export default Zapier;
