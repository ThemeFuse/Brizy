const makeUrl = (baseUrl, params) => {
  let url = new URL(baseUrl);

  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });

  return url;
};

const parseJSON = response => {
  return new Promise(resolve =>
    response.json().then(json =>
      resolve({
        status: response.status,
        ok: response.ok,
        json
      })
    )
  );
};

export default function makeRequest(_options) {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8"
  });
  const { queryParams, url, ...options } = _options;
  const requestUrl = makeUrl(url, queryParams);

  return new Promise((resolve, reject) => {
    fetch(requestUrl, {
      headers,
      credentials: "same-origin",
      ...options
    })
      .then(parseJSON)
      .then(res => resolve(res.json.data))
      .catch(error =>
        reject({
          code: error.message
        })
      );
  });
}
