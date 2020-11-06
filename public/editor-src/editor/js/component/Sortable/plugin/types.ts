export type Rect = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

type AcceptElements =
  | "*"
  | string[]
  | ((
      from: {
        sortableNode: Element;
        elementNode: Element;
        elementType: string;
      },
      to: {
        sortableNode: Element;
      }
    ) => boolean);
export type SortablePluginOptions = {
  acceptElements: AcceptElements;
  isGrid: boolean;
  showLines: boolean;
  distance: number;
  blindZone: Rect;
  dragOffset: { top: number; left: number };
  chosenClass: string;
  receiverClass: string;
  hoveredClass: string;
  hoveredClassTop: string;
  hoveredClassBottom: string;
  hoveredClassLeft: string;
  hoveredClassRight: string;
  helperClass: string;
  placeholderClass: string;
  cancelClass: string;
  onBeforeStart?: (e: {
    defaultPrevented: boolean;
    preventDefault: () => void;
  }) => void;
  onStart?: () => void;
  onSort?: (data: {
    from: {
      sortableNode: Element;
      elementNode: Element;
      elementIndex: number;
      elementType: string;
    };
    to: {
      sortableNode: Element;
      elementIndex: number;
    };
  }) => void;
  onEnd?: () => void;
};

export type SortableInfo = {
  depth: number;
  zIndex: number;
  isGrid: boolean;
  acceptElements: AcceptElements;
};

export type GlobalState = {
  allSortables: Element[];
  sortableInfo: WeakMap<Element, SortableInfo>;
  dragInfo: {
    dragInProgress: boolean;
    source?: {
      sourceSortable: Element;
      sourceElement: Element;
      sourceElementIndex: number;
      sourceTouch: {
        clientX: number;
        clientY: number;
      };
    };
    target?: {
      targetSortable: Element;
      targetElement?: Element;
      targetElementIndex: number;
    };
    receiverSortables?: Element[];
  };
};
