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
    .then(json => ({
      ...json,
      status: response.status,
      ok: response.ok,
      data: json.data || null
    }))
    .catch(() => {
      throw {
        status: 500,
        data: "Server Error"
      };
    });
};

export const fakeRequest = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 650);
  });
