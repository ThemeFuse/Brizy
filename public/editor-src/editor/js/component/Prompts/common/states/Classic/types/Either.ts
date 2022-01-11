// region Left
export type Left<T> = { type: "left"; value: T };

export const left = <T>(value: T): Left<T> => ({ type: "left", value });
// endregion

// region Right
export type Right<T> = { type: "right"; value: T };

export const right = <T>(value: T): Right<T> => ({ type: "right", value });
// endregion

export type Either<A, B> = Left<A> | Right<B>;
