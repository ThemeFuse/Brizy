export type Response<R> = (r: R) => void;

export interface ResponseWithBody<T> {
  status: number;
  ok: boolean;
  data: T;
}
