export interface Response {
  status: number;
  message: string;
}

type fromJqXHR = (r: {
  status: number;
  responseJSON: { message: string };
}) => Response;

export const fromJqXHR: fromJqXHR = r => {
  return {
    status: r.status,
    message: r.responseJSON.message
  };
};
