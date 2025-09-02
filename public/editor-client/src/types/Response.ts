export type Response<R> = (r: R) => void;

export interface ResponseWithBody<T> {
  status: number;
  ok: boolean;
  data: T;
}

export interface ResponseWithSuccessStatus<T extends boolean = boolean> {
  success: T;
}

export type SuccessResponse = ResponseWithSuccessStatus<true>;
