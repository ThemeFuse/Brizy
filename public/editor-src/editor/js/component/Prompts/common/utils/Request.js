export const makeUrl = (baseUrl, params = {}) => {
  let url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return url;
};

export const parseJSON = response => {
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
