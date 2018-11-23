import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import ItemItems from "./ItemItems";
import defaultValue from "./itemDefaultValue.json";
import Toolbar from "visual/component/Toolbar";
import TextEditor from "visual/editorComponents/Text/Editor";

class AccordionItem extends EditorComponent {
  static get componentId() {
    return "AccordionItem";
  }

  static defaultProps = {
    meta: {}
  };

  static defaultValue = defaultValue;

  handleTextChange = labelText => {
    this.patchValue({ labelText });
  };

  renderForEdit(v) {
    const { className, meta, handleAccordion, toolbarExtend } = this.props;
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      className: "brz-accordion--sortable",
      meta
    });

    return (
      <div className={className}>
        <Toolbar {...toolbarExtend}>
          <div className="brz-accordion__nav" onClick={handleAccordion}>
            <TextEditor value={v.labelText} onChange={this.handleTextChange} />
          </div>
        </Toolbar>
        <div className="brz-accordion__content">
          <ItemItems {...itemsProps} />
        </div>
      </div>
    );
  }
}

export default AccordionItem;
