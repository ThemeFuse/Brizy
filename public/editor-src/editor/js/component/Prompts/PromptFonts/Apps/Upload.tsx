import { BaseApp } from "../../common/GlobalApps/BaseApp";
import { Variation } from "../Step";
import Done from "../Step/Done";
import Upload from "../Step/Upload";

class Uploader extends BaseApp {
  static upload = Upload;
  static variation = Variation;
  static done = Done;
}

export default Uploader;
