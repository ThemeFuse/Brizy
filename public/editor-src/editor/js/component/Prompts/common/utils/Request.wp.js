export const makeUrl = (baseUrl, params = {}) => {
  let url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  return url;
};

export const parseJSON = res => {
  return res
    .json()
    .then(json => ({
      ...json,
      status: res.status,
      ok: res.ok,
      data: json.data || null
    }))
    .then(reqStatus)
    .catch(() => {
      throw {
        status: 500,
        data: "Server Error"
      };
    });
};

// For wp if success === false
// need see in data.code the status code
const reqStatus = res => {
  if (res.success) {
    return res;
  } else {
    const { data } = res;
    return {
      ...res,
      status: data.code || res.status
    };
  }
};

export const fakeRequest = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 650);
  });
