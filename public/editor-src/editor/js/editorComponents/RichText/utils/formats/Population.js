import Quill from "quill";

let Inline = Quill.import("blots/inline");

class Population extends Inline {
  static create(value) {
    const node = super.create(value);
    this.setValue(value, node);
    return node;
  }

  static formats(node) {
    const population = node.getAttribute('data-population');

    if (population) {
      return population;
    }

    return null;
  }

  static setValue(population, node) {
    if (population) {
      node.setAttribute('data-population', population);
    }
  }

  static removeValue(node) {
    node.removeAttribute('data-population');
  }


  format(name, value) {
    if (name !== this.statics.blotName) {
      super.format(name, value);
    } else {
      value ? this.constructor.setValue(value, this.domNode) : this.constructor.removeValue(this.domNode)
    }
  }
}
Population.blotName = 'population';
Population.tagName = 'SPAN';

export { Population as default };