import {
  events,
  closest,
  nodeIndex,
  nodeDepth,
  addClass,
  removeClass,
  hasClass,
  pointDistance,
  pointRelative,
  isInsideRect,
  rectCenter,
  clamp,
  find,
  isArray,
  toArray
} from "./utils";

const defaults = {
  acceptElements: [],
  isGrid: false,
  blindZone: null,
  chosenClass: "sortable-chosen",
  receiverClass: "sortable-receiver",
  hoveredClass: "sortable-hovered",
  hoveredClassTop: "sortable-hovered-top",
  hoveredClassBottom: "sortable-hovered-bottom",
  hoveredClassLeft: "sortable-hovered-left",
  hoveredClassRight: "sortable-hovered-right",
  helperClass: "sortable-helper",
  placeholderClass: "sortable-placeholder",
  cancelClass: "sortable-cancel",
  distance: 5,
  onBeforeStart: null,
  onStart: null,
  onSort: null,
  onEnd: null
};
let globalState = {
  dragInProgress: false
};
let allSortableNodes = [];

class Sortable {
  constructor(el, options) {
    // options
    this.options = options;
    for (let key in defaults) {
      if (!(key in this.options)) {
        this.options[key] = defaults[key];
      }
    }

    // instance fields
    this.el = el;
    this.document = this.el.ownerDocument || document;

    // sortableInfo
    let zIndex = 0;
    closest(this.el, el => {
      if (el.hasAttribute("data-sortable-zindex")) {
        // this is done in unlikely case that an element
        // with sortableZIndex is located inside another such element
        zIndex += Number(el.getAttribute("data-sortable-zindex"));
      }
    });
    this.el.sortableInfo = {
      depth: nodeDepth(this.el),
      zIndex: zIndex,
      isGrid: this.options.isGrid,
      acceptElements: this.options.acceptElements || null
    };

    // dragInfo
    this.dragInfo = {
      sourceSortable: null,
      sourceElement: null,
      receiverSortables: null,
      sourceElementIndex: null,
      targetSortable: null,
      targetElement: null,
      targetElementIndex: null,
      originalTouch: null
    };

    // helper
    this.helper = this.document.createElement("div");
    this.helper.className = this.options.helperClass;
    this.helper.style.position = "fixed";
    this.helper.style.zIndex = 1000000;
    this.helper.style.top = 0;
    this.helper.style.left = 0;
    this.helper.style["will-change"] = "transform";

    // placeholder
    // this.placeholder = this.document.createElement('div');
    // this.placeholder.className = this.options.placeholderClass;

    // event handlers
    this.handleContainerStart = this.handleContainerStart.bind(this);
    this.handlePendingMove = this.handlePendingMove.bind(this);
    this.handlePendingEnd = this.handlePendingEnd.bind(this);
    this.handleSortMove = this.handleSortMove.bind(this);
    this.handleSortEnd = this.handleSortEnd.bind(this);

    this.registerSortable();
    this.attachContainerEvents();
  }

  destroy() {
    this.detachContainerEvents();
    this.unregisterSortable();
  }

  // register / unregister

  registerSortable() {
    allSortableNodes.push(this.el);
  }

  unregisterSortable() {
    const index = allSortableNodes.indexOf(this.el);

    allSortableNodes.splice(index, 1);
  }

  // handlers

  handleContainerStart(e) {
    if (globalState.dragInProgress) {
      return; // another drag in progress
    }

    if (e.button !== 0) {
      return; // only left mouse button
    }

    const { distance, cancelClass, onBeforeStart } = this.options;

    const targetCancels = closest(e.target, el => hasClass(el, cancelClass));
    if (targetCancels) {
      return; // don't start dnd
    }

    const node = closest(e.target, el =>
      el.hasAttribute("data-sortable-element")
    );
    if (!node) {
      return; // invalid or missing node. It happened sometimes although not sure why
    }

    const nodeUsesHandle = node.hasAttribute("data-sortable-use-handle");
    if (nodeUsesHandle) {
      const targetIsHandle = closest(e.target, el =>
        el.hasAttribute("data-sortable-handle")
      );

      if (!targetIsHandle) {
        return;
      }
    }

    if (distance) {
      if (onBeforeStart) {
        const data = {
          defaultPrevented: false,
          preventDefault() {
            this.defaultPrevented = true;
          }
        };
        onBeforeStart(data);

        if (data.defaultPrevented) {
          return;
        }
      }

      globalState.dragInProgress = true;

      this.dragInfo.sourceSortable = this.el;
      this.dragInfo.sourceElement = node;
      this.dragInfo.sourceElementIndex = nodeIndex(node);
      this.dragInfo.originalTouch = {
        clientX: e.clientX,
        clientY: e.clientY
      };

      this.attachPendingEvents();
    } else {
      throw Error("Not implemented yet. No distance");
    }
  }

  handlePendingMove(e) {
    const { distance } = this.options;
    const { originalTouch } = this.dragInfo;

    const delta = pointDistance(
      originalTouch.clientX,
      originalTouch.clientY,
      e.clientX,
      e.clientY
    );

    if (delta > distance) {
      this.detachPendingEvents();
      this.handleSortStart(e);
    }
  }

  handlePendingEnd(e) {
    this.detachPendingEvents();
    this.resetDragInfo();
    this.resetGlobalState();
  }

  handleSortStart(e) {
    const { chosenClass, receiverClass, onStart } = this.options;

    this.addHelper(e);

    // dragInfo
    this.dragInfo.receiverSortables = this.findReceiverSortables();
    this.dragInfo.receiverSortables.forEach(node =>
      addClass(node, receiverClass)
    );
    addClass(this.dragInfo.sourceElement, chosenClass);

    if (onStart) {
      onStart();
    }

    this.attachSortEvents();
  }

  handleSortMove(e) {
    this.updateHelperPosition(e);
    this.updateDragInfo(e);
    // this.updatePlaceholder(e);
  }

  handleSortEnd(e) {
    const { onSort, onEnd } = this.options;
    const {
      sourceSortable,
      sourceElement,
      sourceElementIndex,
      targetSortable,
      targetElement,
      targetElementIndex
    } = this.dragInfo;

    this.detachSortEvents();
    this.resetDragInfoClasses();
    this.removeHelper();
    // this.removePlaceholder();
    this.resetDragInfo();
    this.resetGlobalState();

    if (onSort && targetElement && targetElementIndex !== null) {
      const sourceElementType = sourceElement.getAttribute(
        "data-sortable-type"
      );

      onSort({
        from: {
          sortableNode: sourceSortable,
          elementNode: sourceElement,
          elementIndex: sourceElementIndex,
          elementType: sourceElementType
        },
        to: {
          sortableNode: targetSortable,
          elementIndex: targetElementIndex
        }
      });
    }

    if (onEnd) {
      onEnd();
    }
  }

  // helper

  addHelper(e) {
    this.document.body.appendChild(this.helper);

    this.helperRect = this.helper.getBoundingClientRect();

    this.updateHelperPosition(e);
  }

  updateHelperPosition(e) {
    const x = e.clientX - this.helperRect.width / 2;
    const y = e.clientY - this.helperRect.height / 2;

    this.helper.style["transform"] = `translate(${x}px,${y}px)`;
  }

  removeHelper() {
    this.helper.parentNode && this.helper.parentNode.removeChild(this.helper);
  }

  // dragInfo

  updateDragInfo(e) {
    const {
      hoveredClass,
      hoveredClassTop,
      hoveredClassBottom,
      hoveredClassLeft,
      hoveredClassRight,
      blindZone
    } = this.options;
    const { clientX: x, clientY: y } = e;

    // sortable
    this.dragInfo.targetSortable = null;

    // element
    if (this.dragInfo.targetElement) {
      removeClass(
        this.dragInfo.targetElement,
        hoveredClass,
        hoveredClassTop,
        hoveredClassBottom,
        hoveredClassLeft,
        hoveredClassRight
      );

      this.dragInfo.targetElement.previousElementSibling &&
        removeClass(
          this.dragInfo.targetElement.previousElementSibling,
          hoveredClass,
          hoveredClassTop,
          hoveredClassBottom
        );
    }

    this.dragInfo.targetElement = null;

    // index
    this.dragInfo.targetElementIndex = null;

    // blind zone
    if (blindZone) {
      const isInsideBlindZone = isInsideRect(x, y, blindZone);

      if (isInsideBlindZone) {
        return;
      }
    }

    const closestSortable = this.findClosestSortable(x, y);
    if (closestSortable) {
      if (this.dragInfo.sourceElement.contains(closestSortable)) {
        return;
      }

      const closestNode = this.findClosestNode(x, y, closestSortable);
      if (closestNode === this.dragInfo.sourceElement) {
        return;
      }

      // sortable
      this.dragInfo.targetSortable = closestSortable;

      // element
      this.dragInfo.targetElement = closestNode; // can be null

      // index
      this.dragInfo.targetElementIndex = 0;

      if (closestNode) {
        const closestNodeRect = closestNode.getBoundingClientRect();
        const { x: centerX, y: centerY } = rectCenter(closestNodeRect);
        const { isAbove, isLeft } = pointRelative(
          e.clientX,
          e.clientY,
          centerX,
          centerY
        );
        const isGrid = closestSortable.sortableInfo.isGrid;

        const isBefore = isGrid ? isLeft : isAbove;
        this.dragInfo.targetElementIndex =
          nodeIndex(closestNode) + (isBefore ? 0 : 1);
        if (
          this.dragInfo.sourceSortable === this.dragInfo.targetSortable &&
          this.dragInfo.targetElementIndex > this.dragInfo.sourceElementIndex
        ) {
          this.dragInfo.targetElementIndex -= 1;
        }

        let targetElement = this.dragInfo.targetElement;
        let hoveredClassPosition = "";
        if (isGrid) {
          if (isLeft) {
            hoveredClassPosition = hoveredClassLeft;
          } else {
            hoveredClassPosition = hoveredClassRight;
          }
        } else {
          if (isAbove) {
            const previousSibling = targetElement.previousElementSibling;

            if (
              !previousSibling ||
              previousSibling === this.dragInfo.sourceElement
            ) {
              hoveredClassPosition = hoveredClassTop;
            } else {
              targetElement = previousSibling;
              hoveredClassPosition = hoveredClassBottom;
            }
          } else {
            hoveredClassPosition = hoveredClassBottom;
          }
        }

        addClass(targetElement, hoveredClass, hoveredClassPosition);
      }
    }
  }

  resetDragInfoClasses() {
    const {
      receiverClass,
      chosenClass,
      hoveredClass,
      hoveredClassTop,
      hoveredClassBottom,
      hoveredClassLeft,
      hoveredClassRight
    } = this.options;
    const { sourceElement, targetElement, receiverSortables } = this.dragInfo;

    receiverSortables.forEach(node => removeClass(node, receiverClass));
    removeClass(sourceElement, chosenClass);
    if (targetElement) {
      removeClass(
        targetElement,
        hoveredClass,
        hoveredClassTop,
        hoveredClassBottom,
        hoveredClassLeft,
        hoveredClassRight
      );

      targetElement.previousElementSibling &&
        removeClass(
          targetElement.previousElementSibling,
          hoveredClass,
          hoveredClassTop,
          hoveredClassBottom
        );
    }
  }

  resetDragInfo() {
    this.dragInfo = {};
  }

  findReceiverSortables() {
    const { sourceSortable, sourceElement } = this.dragInfo;
    const sourceElementType = sourceElement.getAttribute("data-sortable-type");

    return allSortableNodes.filter(node => {
      if (
        node.dataset.sortableDisabled === "true" ||
        node.closest("[data-sortable-disabled='true']")
      ) {
        return false;
      }

      // call custom filter callback if provided
      if (typeof node.sortableInfo.acceptElements === "function") {
        const from = {
          sortableNode: sourceSortable,
          elementNode: sourceElement,
          elementType: sourceElementType
        };
        const to = {
          sortableNode: node
        };

        return node.sortableInfo.acceptElements(from, to);
      }

      return (
        node.sortableInfo.acceptElements === "*" ||
        (isArray(node.sortableInfo.acceptElements) &&
          node.sortableInfo.acceptElements.indexOf(sourceElementType) !== -1)
      );
    });
  }

  findClosestSortable(x, y) {
    // get the most deep sortable that contains the point
    const closest = this.dragInfo.receiverSortables.reduce(
      (acc, node) => {
        const rect = node.getBoundingClientRect();

        if (isInsideRect(x, y, rect)) {
          const zIndex = node.sortableInfo.zIndex;
          const depth = node.sortableInfo.depth;

          if (
            zIndex > acc.zIndex ||
            (zIndex === acc.zIndex && depth > acc.depth)
          ) {
            return { node, depth, zIndex };
          }
        }

        return acc;
      },
      { node: null, depth: -1, zIndex: -1 }
    );

    return closest.node;
  }

  findClosestNode(x, y, sortable) {
    const nodes = toArray(sortable.children);

    if (nodes.length === 0) {
      return null;
    } else if (nodes.length === 1) {
      return nodes[0];
    } else {
      return nodes.reduce(
        (closestNode, node) => {
          const rect = node.getBoundingClientRect();
          const x2 = clamp(x, rect.left, rect.right);
          const y2 = clamp(y, rect.top, rect.bottom);
          const distance = pointDistance(x, y, x2, y2);

          if (distance < closestNode.distance) {
            return {
              node,
              distance
            };
          } else {
            return closestNode;
          }
        },
        {
          node: null,
          distance: Infinity
        }
      ).node;
    }
  }

  // placeholder

  getPlaceholderIndex() {
    if (!this.placeholder.parentNode) {
      return null;
    }

    const {
      sourceSortable,
      sourceElementIndex,
      targetSortable
    } = this.dragInfo;
    const placeholderIndex = nodeIndex(this.placeholder);

    if (sourceSortable !== targetSortable) {
      return placeholderIndex;
    } else {
      return placeholderIndex > sourceElementIndex
        ? placeholderIndex - 1
        : placeholderIndex;
    }
  }

  updatePlaceholder(e) {
    const { sourceElement, targetSortable, targetElement } = this.dragInfo;

    if (
      targetSortable &&
      targetElement // &&
      // targetElement !== sourceElement
    ) {
      const isGrid = targetSortable.sortableInfo.isGrid;
      const targetElementRect = targetElement.getBoundingClientRect();
      const { x: centerX, y: centerY } = rectCenter(targetElementRect);
      const { isAbove, isLeft } = pointRelative(
        e.clientX,
        e.clientY,
        centerX,
        centerY
      );
      const comparator = isGrid ? isLeft : isAbove;
      const referenceNode = comparator
        ? targetElement
        : targetElement.nextSibling;

      targetSortable.insertBefore(this.placeholder, referenceNode);
    } else {
      this.removePlaceholder();
    }
  }

  removePlaceholder() {
    this.placeholder.parentNode &&
      this.placeholder.parentNode.removeChild(this.placeholder);
  }

  // global state

  resetGlobalState() {
    globalState.dragInProgress = false;
  }

  // DOM events

  attachContainerEvents() {
    events.start.forEach(eventName =>
      this.el.addEventListener(eventName, this.handleContainerStart, false)
    );
  }

  detachContainerEvents() {
    events.start.forEach(eventName =>
      this.el.removeEventListener(eventName, this.handleContainerStart, false)
    );
  }

  attachPendingEvents() {
    events.move.forEach(eventName =>
      this.document.addEventListener(eventName, this.handlePendingMove, false)
    );

    events.end.forEach(eventName =>
      this.document.addEventListener(eventName, this.handlePendingEnd, false)
    );
  }

  detachPendingEvents() {
    events.move.forEach(eventName =>
      this.document.removeEventListener(
        eventName,
        this.handlePendingMove,
        false
      )
    );

    events.end.forEach(eventName =>
      this.document.removeEventListener(eventName, this.handlePendingEnd, false)
    );
  }

  attachSortEvents() {
    events.move.forEach(eventName =>
      this.document.addEventListener(eventName, this.handleSortMove, false)
    );

    events.end.forEach(eventName =>
      this.document.addEventListener(eventName, this.handleSortEnd, false)
    );
  }

  detachSortEvents() {
    events.move.forEach(eventName =>
      this.document.removeEventListener(eventName, this.handleSortMove, false)
    );

    events.end.forEach(eventName =>
      this.document.removeEventListener(eventName, this.handleSortEnd, false)
    );
  }
}

export default Sortable;
