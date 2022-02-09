import { CartApi } from "../types/Api";
import { from, of, ReplaySubject } from "rxjs";
import { Product } from "../../types/Product";
import * as Actions from "./types/Actions";
import * as State from "./types/State";
import {
  catchError,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  mapTo,
  switchMap,
  withLatestFrom
} from "rxjs/operators";
import { reducer } from "visual/libs/shopify/Stores/AddToCart/reducer";
import { VariationId } from "visual/libs/shopify/types/Variation";

const stores: Record<string, Store | undefined> = {};

class Store {
  private readonly stateSubject: ReplaySubject<State.State>;
  private readonly actionSubject: ReplaySubject<Actions.Actions>;

  constructor(product: Product, public readonly cartClient: CartApi) {
    this.stateSubject = new ReplaySubject<State.State>();
    this.actionSubject = new ReplaySubject<Actions.Actions>();

    this.actionSubject
      .pipe(
        withLatestFrom(this.stateSubject),
        map(([a, s]) => reducer(a, s))
      )
      .subscribe(this.stateSubject);

    this.stateSubject
      .pipe(
        distinctUntilKeyChanged("type"),
        filter((s): s is State.Submitting => s.type === "Submitting"),
        switchMap(s =>
          from(
            this.cartClient.add([
              {
                id: s.variationId,
                quantity: s.quantity
              }
            ])
          ).pipe(
            mapTo(Actions.submitSuccess()),
            catchError((e: Response) =>
              of(Actions.submitErr({ code: e.status, message: e.statusText }))
            )
          )
        )
      )
      .subscribe(this.actionSubject);

    this.stateSubject.next(
      State.ready(product.handle, 0, product.variants[0].id)
    );
  }

  get observable() {
    return this.stateSubject.pipe(distinctUntilChanged());
  }

  submit(): void {
    this.actionSubject.next(Actions.submit());
  }

  setQuantity = (quantity: number): void => {
    this.actionSubject.next(Actions.setQuantity(quantity));
  };

  setVariation = (id: VariationId): void => {
    this.actionSubject.next(Actions.setVariation(id));
  };
}

export const getStore = (product: Product, cartClient: CartApi): Store => {
  const store = stores[product.id];

  if (store) {
    return store;
  }

  const newStore = new Store(product, cartClient);

  stores[product.id] = newStore;

  return newStore;
};
