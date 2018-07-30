import React from "react";
import Editor from "visual/global/Editor";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";

class Blocks extends EditorArrayComponent {
  static get componentId() {
    return "Page.Blocks";
  }

  // getDefaultValueOld() {
  //   return [
  //     {
  //       type: "Text",
  //       value: {
  //         // color: "green"
  //       }
  //     },
  //     {
  //       type: "Text",
  //       value: {
  //         // fontFamily: "monospace"
  //       }
  //     },
  //     {
  //       type: "Text",
  //       value: {}
  //     }
  //   ];
  // }

  handleBlockAdd = (blockId, index) => {
    const block = Editor.getBlock(blockId);

    this.insertItem(index, {
      blockId,
      ...block.resolve
    });
  };

  handleBlockRemove = index => {
    this.removeItem(index);
  };

  renderItemWrapper(item, itemIndex) {
    const adderStyle = {
      marginBottom: "20px"
    };
    const adderLinks = Object.values(Editor.getBlocks()).map(block => (
      <button
        key={block.id}
        onClick={() => this.handleBlockAdd(block.id, itemIndex + 1)}
      >
        Add {block.title}
      </button>
    ));
    const removerStyle = {
      marginLeft: "30px"
    };

    return (
      <div key={itemIndex} className="block">
        {item}
        <div className="blocks-adder" style={adderStyle}>
          {adderLinks}
          <button
            style={removerStyle}
            onClick={() => this.handleBlockRemove(itemIndex)}
          >
            Remove Block
          </button>
        </div>
      </div>
    );
  }

  renderItemsContainer(items) {
    if (items.length === 0) {
      const adderStyle = {
        marginBottom: "20px"
      };
      const adderLinks = Object.values(Editor.getBlocks()).map(block => (
        <button key={block.id} onClick={() => this.handleBlockAdd(block.id, 0)}>
          Add {block.title}
        </button>
      ));

      return <div>{adderLinks}</div>;
    }

    return <div className="blocks-container">{items}</div>;
  }
}

export default Blocks;
