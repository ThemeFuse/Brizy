import { AuthConnect, Account, Fields, List, Done } from "../Step";

class Aweber {
  static connect = AuthConnect;
  static account = Account;
  static fields = Fields;
  static list = List;
  static done = Done;
}

export default Aweber;
