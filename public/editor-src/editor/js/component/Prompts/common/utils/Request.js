const makeUrl = (baseUrl, params = {}) => {
  let url = new URL(baseUrl);

  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });

  return url;
};

const parseJSON = response => {
  return response
    .json()
    .then(json => ({
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

const request = _options => {
  const { queryParams, url, contentType, ...options } = _options;
  const headers = new Headers({
    "Content-Type": contentType || "application/json; charset=utf-8"
  });
  const requestUrl = makeUrl(url, queryParams);

  return fetch(requestUrl, {
    headers,
    credentials: "same-origin",
    ...options
  })
    .then(parseJSON)
    .then(res => res);
};

export async function makeRequest(options) {
  try {
    return await request(options);
  } catch (error) {
    return error;
  }
}

export const fakeRequest = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 650);
  });
