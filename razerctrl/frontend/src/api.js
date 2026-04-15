const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fetchDevices = async () => {
  const res = await fetch(`${API_URL}/api/devices`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const fetchDeviceState = async (serial) => {
  const res = await fetch(`${API_URL}/api/device/${serial}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const setLighting = async (data) => {
  const res = await fetch(`${API_URL}/api/lighting`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const setPerformance = async (data) => {
  const res = await fetch(`${API_URL}/api/performance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchPresets = async (deviceName) => {
  const res = await fetch(`${API_URL}/api/remap/${deviceName}`);
  return res.json();
};

export const savePreset = async (data) => {
  const res = await fetch(`${API_URL}/api/remap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchProfiles = async () => {
  const res = await fetch(`${API_URL}/api/profiles`);
  return res.json();
};

export const saveProfile = async (name, data) => {
  const res = await fetch(`${API_URL}/api/profiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, data }),
  });
  return res.json();
};

export const deleteProfile = async (name) => {
  const res = await fetch(`${API_URL}/api/profiles/${name}`, {
    method: 'DELETE',
  });
  return res.json();
};
