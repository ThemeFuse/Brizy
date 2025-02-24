import TextField from "./common/TextField";

export default class Tel extends TextField {
  static get componentType() {
    return "Tel";
  }

  static pattern = "[0-9()#&+*-=.]+";
}
