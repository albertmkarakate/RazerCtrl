const API_BASE = '/api';

export interface Device {
  id: string;
  name: string;
  type: string;
  vid_pid: string;
  capabilities: {
    has_lighting: boolean;
    has_dpi: boolean;
    has_poll_rate: boolean;
    has_matrix: boolean;
    max_dpi: number | null;
  };
}

export interface DeviceState {
  serial: string;
  name: string;
  battery: number | null;
  dpi?: [number, number];
  poll_rate?: number;
}

export const api = {
  async getDevices(): Promise<Device[]> {
    const res = await fetch(`${API_BASE}/devices`);
    if (!res.ok) throw new Error('Failed to fetch devices');
    return res.json();
  },

  async getDeviceState(serial: string): Promise<DeviceState> {
    const res = await fetch(`${API_BASE}/device/${serial}`);
    if (!res.ok) throw new Error('Failed to fetch device state');
    return res.json();
  },

  async setLighting(data: {
    serial: string;
    zone?: string;
    effect: string;
    colour_hex?: string;
    speed?: number;
    direction?: string;
  }) {
    const res = await fetch(`${API_BASE}/lighting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zone: 'matrix',
        colour_hex: '#00ff41',
        speed: 2,
        direction: 'right',
        ...data
      }),
    });
    return res.json();
  },

  async setPerformance(data: {
    serial: string;
    dpi_x?: number;
    dpi_y?: number;
    poll_rate?: number;
  }) {
    const res = await fetch(`${API_BASE}/performance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async setExternalColor(ip: string, color: string) {
    try {
      // The user's requested pattern: http://IP:5000/set_color/color
      const res = await fetch(`http://${ip}:5000/set_color/${color}`, { mode: 'no-cors' });
      return res;
    } catch (e) {
      console.error('External sync failed', e);
    }
  }
};
