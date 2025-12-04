export default async function validation(data) {
  try {
    return await validationFacebook(data);
  } catch (_) {
    return false;
  }
}

function validationFacebook(appId) {
  return fetch(`https://graph.facebook.com/${appId}`).then(
    ({ status }) => status === 200
  );
}
