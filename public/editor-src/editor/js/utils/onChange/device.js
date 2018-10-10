function syncOnChange(device, v, key) {
  const capKey =
    String(key)
      .charAt(0)
      .toUpperCase() + String(key).substr(1);
  const deviceKey = device + capKey;

  return v[deviceKey] === null ? v[key] : v[deviceKey];
}

export function tabletSyncOnChange(v, key) {
  return syncOnChange("tablet", v, key);
}

export function mobileSyncOnChange(v, key) {
  return syncOnChange("mobile", v, key);
}

// Utilities
export function keySyncOnChange(key, deviceKey) {
  return deviceKey === null ? key : deviceKey;
}
