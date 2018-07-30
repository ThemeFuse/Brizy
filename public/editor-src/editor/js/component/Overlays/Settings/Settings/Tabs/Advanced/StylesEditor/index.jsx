var _ = require("underscore");
var React = require("react");
var Globals = require("visual/global/Globals");
var CodeMirror = require("visual/component/Overlays/Settings/basic/CodeMirror");

class StylesEditor extends React.Component {
  componentWillMount() {
    this.onCodeMirrorChange = _.debounce(v => {
      Globals.set("userStyles", v, "project");
    }, 1000);
  }

  getCss = () => {
    return (
      Globals.get("userStyles") || "/* Add custom CSS */" + Array(16).join("\n")
    ); // appends 15 new lines
  };

  render() {
    return (
      <div className="brz-ed-popup-metrics-cols">
        <div className="brz-ed-popup-metrics-head">
          <h3 className="brz-h3">STYLES EDITOR</h3>
          <p className="brz-p">
            Write here all your custom css styles and it will be applied to your
            project.
          </p>
        </div>
        <div className="brz-ed-popup-metrics-body">
          <CodeMirror
            value={this.getCss()}
            onChange={this.onCodeMirrorChange}
          />
        </div>
      </div>
    );
  }
}

export default StylesEditor;
