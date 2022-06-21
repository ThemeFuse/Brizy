export const makeUrl = (
  baseUrl: string,
  params: Record<string, string> = {}
): string => {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
};

export interface ResponseWithBody<T> {
  status: number;
  ok: boolean;
  data: T;
}

export const parseJSON = <T>(
  response: Response
): Promise<ResponseWithBody<T>> => {
  return response
    .json()
    .then(body => ({
      status: response.status,
      ok: response.ok,
      data: body || null
    }))
    .catch(() => {
      throw {
        status: 500,
        data: "Server Error"
      };
    });
};
