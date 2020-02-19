import { toggleLock, toggleAlignment, getTitle, getItems } from "./utils";
import { RightSidebarStore, RightSidebarState } from "./index";
import { OptionDefinition } from "../Options/Type";

const someOption: OptionDefinition = {
  id: "test",
  type: "advancedSettings",
  value: {},
  onChange: () => {}
};

describe("Testing 'toggleLock' function", () => {
  const stateWithItems: RightSidebarState = {
    items: [someOption],
    staleItems: [someOption],
    title: "Title",
    staleTitle: "Stale Title"
  };
  const stateWithEmptyItems: RightSidebarState = {
    ...stateWithItems,
    items: []
  };
  const stateWithoutItems: RightSidebarState = {
    ...stateWithItems,
    items: undefined
  };

  test("Should set lock when unlocked", () => {
    const store: RightSidebarStore = {
      isOpen: true,
      lock: undefined,
      alignment: "left"
    };
    const expectedStore: RightSidebarStore = {
      isOpen: true,
      lock: "manual",
      alignment: "left"
    };

    const { store: newStore, state: newState } = toggleLock(
      store,
      stateWithItems
    );

    expect(newStore).toStrictEqual(expectedStore);
    expect(newState).toBe(stateWithItems);
  });

  test("Should unset lock and fakeItems when locked", () => {
    const store: RightSidebarStore = {
      isOpen: true,
      lock: "manual",
      alignment: "left"
    };
    const expectedStore: RightSidebarStore = {
      isOpen: true,
      lock: undefined,
      alignment: "left"
    };

    const { store: newStore, state: newState } = toggleLock(
      store,
      stateWithItems
    );

    expect(newStore).toStrictEqual(expectedStore);
    expect(newState).toBe(stateWithItems);
  });

  test("Should close & unset stale data when unlocking without items", () => {
    const store: RightSidebarStore = {
      isOpen: true,
      lock: "manual",
      alignment: "left"
    };
    const expectedStore: RightSidebarStore = {
      isOpen: false,
      lock: undefined,
      alignment: "left"
    };
    const expectedState = {
      items: undefined,
      staleItems: undefined,
      title: undefined,
      staleTitle: undefined
    };

    const {
      store: newStoreWithEmptyItems,
      state: newStateWithEmptyItems
    } = toggleLock(store, stateWithEmptyItems);
    const {
      store: newStoreWithoutItems,
      state: newStateWithoutItems
    } = toggleLock(store, stateWithoutItems);

    expect(newStoreWithEmptyItems).toStrictEqual(expectedStore);
    expect(newStateWithEmptyItems).toStrictEqual(expectedState);
    expect(newStoreWithoutItems).toStrictEqual(expectedStore);
    expect(newStateWithoutItems).toStrictEqual(expectedState);
  });
});

describe("Testing 'toggleAlignment' function", () => {
  test("Should set right when left", () => {
    const store: RightSidebarStore = {
      isOpen: true,
      lock: undefined,
      alignment: "left"
    };
    const expected: RightSidebarStore = {
      isOpen: true,
      lock: undefined,
      alignment: "right"
    };

    expect(toggleAlignment(store)).toStrictEqual(expected);
  });

  test("Should unset left when right", () => {
    const store: RightSidebarStore = {
      isOpen: true,
      lock: undefined,
      alignment: "right"
    };
    const expected: RightSidebarStore = {
      isOpen: true,
      lock: undefined,
      alignment: "left"
    };

    expect(toggleAlignment(store)).toStrictEqual(expected);
  });
});

describe("Testing 'getTitle' function", () => {
  test.each([
    [
      {
        isOpen: true
      },
      {
        title: "title",
        staleTitle: "stale title"
      },
      "title"
    ],
    [
      {
        isOpen: true
      },
      {
        title: "title",
        staleTitle: undefined
      },
      "title"
    ]
  ])(
    "Should return title when isOpen is true and title is not empty",
    (props, state, expected) => {
      expect(getTitle(props, state)).toBe(expected);
    }
  );

  test.each([
    [
      {
        isOpen: true
      },
      {
        title: undefined,
        staleTitle: "stale title"
      },
      undefined
    ],
    [
      {
        isOpen: true
      },
      {
        title: undefined,
        staleTitle: undefined
      },
      undefined
    ]
  ])(
    "Should return undefined when isOpen is true and title is empty",
    (props, state, expected) => {
      expect(getTitle(props, state)).toBe(expected);
    }
  );

  test.each([
    [
      {
        isOpen: false
      },
      {
        title: "title",
        staleTitle: "stale title"
      },
      "stale title"
    ],
    [
      {
        isOpen: false
      },
      {
        title: undefined,
        staleTitle: "stale title"
      },
      "stale title"
    ]
  ])(
    "Should return staleTitle when isOpen is false and staleTitle is not empty",
    (props, state, expected) => {
      expect(getTitle(props, state)).toBe(expected);
    }
  );

  test.each([
    [
      {
        isOpen: false
      },
      {
        title: "title",
        staleTitle: undefined
      },
      "title"
    ]
  ])(
    "Should return title when isOpen is false, staleTitle is empty and title is not empty",
    (props, state, expected) => {
      expect(getTitle(props, state)).toBe(expected);
    }
  );

  test.each([
    [
      {
        isOpen: false
      },
      {
        title: undefined,
        staleTitle: undefined
      },
      undefined
    ]
  ])(
    "Should return undefined when isOpen is false, staleTitle is empty and title is empty",
    (props, state, expected) => {
      expect(getTitle(props, state)).toBe(expected);
    }
  );
});

describe("Testing 'getItems' function", () => {
  const items: OptionDefinition[] = [someOption];
  const itemsEmpty: OptionDefinition[] = [];
  const staleItems: OptionDefinition[] = [someOption];
  const staleItemsEmpty: OptionDefinition[] = [];

  test.each([
    [
      {
        isOpen: true
      },
      {
        items,
        staleItems
      },
      items
    ],
    [
      {
        isOpen: true
      },
      {
        items,
        staleItems: staleItemsEmpty
      },
      items
    ],
    [
      {
        isOpen: true
      },
      {
        items,
        staleItems: undefined
      },
      items
    ]
  ])(
    "Should return items when isOpen is true and items are none empty",
    (props, state, expected) => {
      expect(getItems(props, state)).toBe(expected);
    }
  );

  test.each([
    [
      {
        isOpen: true
      },
      {
        items: itemsEmpty,
        staleItems
      },
      undefined
    ],
    [
      {
        isOpen: true
      },
      {
        items: itemsEmpty,
        staleItems: staleItemsEmpty
      },
      undefined
    ],
    [
      {
        isOpen: true
      },
      {
        items: itemsEmpty,
        staleItems: undefined
      },
      undefined
    ],
    [
      {
        isOpen: true
      },
      {
        items: undefined,
        staleItems
      },
      undefined
    ],
    [
      {
        isOpen: true
      },
      {
        items: undefined,
        staleItems: staleItemsEmpty
      },
      undefined
    ],
    [
      {
        isOpen: true
      },
      {
        items: undefined,
        staleItems: undefined
      },
      undefined
    ]
  ])(
    "Should return undefined when isOpen is true and items are empty",
    (props, state, expected) => {
      expect(getItems(props, state)).toBe(expected);
    }
  );

  test.each([
    [
      {
        isOpen: false
      },
      {
        items,
        staleItems
      },
      staleItems
    ],
    [
      {
        isOpen: false
      },
      {
        items: itemsEmpty,
        staleItems
      },
      staleItems
    ],
    [
      {
        isOpen: false
      },
      {
        items: undefined,
        staleItems
      },
      staleItems
    ]
  ])(
    "Should return staleItems when isOpen is false and staleItems are none empty",
    (props, state, expected) => {
      expect(getItems(props, state)).toBe(expected);
    }
  );

  test.each([
    [
      {
        isOpen: false
      },
      {
        items,
        staleItems: staleItemsEmpty
      },
      items
    ],
    [
      {
        isOpen: false
      },
      {
        items,
        staleItems: undefined
      },
      items
    ]
  ])(
    "Should return items when isOpen is false, staleItems are empty and items are none empty",
    (props, state, expected) => {
      expect(getItems(props, state)).toBe(expected);
    }
  );

  test.each([
    [
      {
        isOpen: false
      },
      {
        items: itemsEmpty,
        staleItems: staleItemsEmpty
      },
      undefined
    ],
    [
      {
        isOpen: false
      },
      {
        items: undefined,
        staleItems: staleItemsEmpty
      },
      undefined
    ],
    [
      {
        isOpen: false
      },
      {
        items: itemsEmpty,
        staleItems: undefined
      },
      undefined
    ],
    [
      {
        isOpen: false
      },
      {
        items: undefined,
        staleItems: undefined
      },
      undefined
    ]
  ])(
    "Should return undefined when isOpen is false, staleItems are empty and items are empty",
    (props, state, expected) => {
      expect(getItems(props, state)).toBe(expected);
    }
  );
});
