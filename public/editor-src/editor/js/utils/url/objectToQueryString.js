import _ from 'underscore';

export default function objectToQueryString(obj) {
  if (!obj) {
    return '';
  }

  return _.map(obj, function(value, key) {
    return key + '=' + encodeURIComponent(value);
  }).join('&');
};
