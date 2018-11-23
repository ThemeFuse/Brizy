import Config from "visual/global/Config";
import UIState from "visual/global/UIState";
import FormApps from "./FormApps.jsx";

export default class WPFormApps extends FormApps {
  handleMouseDown = event => {
    event.preventDefault();
    const { apiUrl, wpApiUrl } = Config.get("applications").form;
    const { value } = this.props;
    const data = {
      ...value,
      apiUrl,
      wpApiUrl,
      platforms: "wordpress"
    };

    UIState.set("prompt", { prompt: "form-integrations", value: data });
  };
}
