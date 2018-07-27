var _ = require("underscore");
var React = require("react");
var Globals = require("visual/global/Globals");
var CodeMirror = require("visual/component/Overlays/Settings/basic/CodeMirror");

class StylesEditor extends React.Component {
  componentWillMount() {
    this.onCodeMirrorChange = _.debounce(v => {
      Globals.set("userScripts", v, "project");
    }, 1000);
  }

  getHTML = () => {
    return (
      Globals.get("userScripts") ||
      "<!-- Add custom code (Google Analytics, Intercom, etc.) -->" +
        Array(16).join("\n")
    ); // appends 15 new lines
  };

  render() {
    return (
      <div className="brz-ed-popup-metrics-cols">
        <div className="brz-ed-popup-metrics-head">
          <h3 className="brz-h3">CODE INJECTION</h3>
          <p className="brz-p">
            Enter code that will be injected into the template-defined footer on
            your page
          </p>
        </div>
        <div className="brz-ed-popup-metrics-body">
          <CodeMirror
            value={this.getHTML()}
            onChange={this.onCodeMirrorChange}
          />
        </div>
      </div>
    );
  }
}

export default StylesEditor;
