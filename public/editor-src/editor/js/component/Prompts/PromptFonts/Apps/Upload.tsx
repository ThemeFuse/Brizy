import { BaseApp } from "../../common/GlobalApps/BaseApp";
import Upload from "../Step/Upload";
import Variation from "../Step/Variation";
import Done from "../Step/Done";

class Uploader extends BaseApp {
  static upload = Upload;
  static variation = Variation;
  static done = Done;
}

export default Uploader;
