/**
 * Tests for the API client module (src/api.ts).
 *
 * These tests verify that each api method calls fetch with the correct URL,
 * HTTP method, headers, and body — and that it handles success and error
 * responses correctly.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '@src/api';

// Provide a minimal Response-like object that fetch would return.
function jsonResponse(data: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: () => Promise.resolve(data),
  } as unknown as Response;
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('api.getDevices', () => {
  it('fetches /api/devices and returns the JSON array', async () => {
    const devices = [{ id: 'XX', name: 'Test Mouse', type: 'mouse', vid_pid: '1532:0084', capabilities: {} }];
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse(devices));

    const result = await api.getDevices();

    expect(fetch).toHaveBeenCalledWith('/api/devices');
    expect(result).toEqual(devices);
  });

  it('throws on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse(null, false, 503));

    await expect(api.getDevices()).rejects.toThrow('Failed to fetch devices');
  });
});

describe('api.getDeviceState', () => {
  it('fetches /api/device/{serial}', async () => {
    const state = { serial: 'XX', name: 'Test', battery: 90, dpi: [800, 800] };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse(state));

    const result = await api.getDeviceState('XX');

    expect(fetch).toHaveBeenCalledWith('/api/device/XX');
    expect(result).toEqual(state);
  });

  it('throws on 404', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse(null, false, 404));

    await expect(api.getDeviceState('NOTFOUND')).rejects.toThrow('Failed to fetch device state');
  });
});

describe('api.setLighting', () => {
  it('sends POST with correct defaults', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse({ status: 'success' }));

    await api.setLighting({ serial: 'XX', effect: 'static' });

    expect(fetch).toHaveBeenCalledWith('/api/lighting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zone: 'matrix',
        colour_hex: '#00ff41',
        speed: 2,
        direction: 'right',
        serial: 'XX',
        effect: 'static',
      }),
    });
  });

  it('allows overriding defaults', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse({ status: 'success' }));

    await api.setLighting({
      serial: 'XX',
      effect: 'wave',
      colour_hex: '#ff0000',
      speed: 3,
      direction: 'left',
    });

    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.colour_hex).toBe('#ff0000');
    expect(body.speed).toBe(3);
    expect(body.direction).toBe('left');
    expect(body.effect).toBe('wave');
  });
});

describe('api.setPerformance', () => {
  it('sends POST with DPI and poll_rate', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse({ status: 'success' }));

    await api.setPerformance({ serial: 'XX', dpi_x: 1600, dpi_y: 1600, poll_rate: 1000 });

    expect(fetch).toHaveBeenCalledWith('/api/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serial: 'XX', dpi_x: 1600, dpi_y: 1600, poll_rate: 1000 }),
    });
  });

  it('sends only provided fields', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse({ status: 'success' }));

    await api.setPerformance({ serial: 'XX', dpi_x: 800 });

    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.serial).toBe('XX');
    expect(body.dpi_x).toBe(800);
    expect(body.dpi_y).toBeUndefined();
  });
});

describe('api.setExternalColor', () => {
  it('fetches the remote sync URL', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(jsonResponse({}));

    await api.setExternalColor('192.168.1.100', 'green');

    expect(fetch).toHaveBeenCalledWith('http://192.168.1.100:5000/set_color/green', { mode: 'no-cors' });
  });

  it('does not throw on network error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));
    // The method should catch the error and not re-throw
    const result = await api.setExternalColor('10.0.0.1', 'red');
    expect(result).toBeUndefined();
  });
});
