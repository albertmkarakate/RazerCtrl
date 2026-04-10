/**
 * Tests for the supported devices data module.
 *
 * These tests validate the integrity and structure of the static device
 * database exported from supported_devices.ts.
 */
import { describe, it, expect } from 'vitest';
import { SUPPORTED_DEVICES, SupportedDevice } from '@src/data/supported_devices';

describe('SUPPORTED_DEVICES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(SUPPORTED_DEVICES)).toBe(true);
    expect(SUPPORTED_DEVICES.length).toBeGreaterThan(0);
  });

  it('contains more than 50 devices', () => {
    expect(SUPPORTED_DEVICES.length).toBeGreaterThan(50);
  });

  describe('each device', () => {
    it('has required fields: name, id, category', () => {
      for (const device of SUPPORTED_DEVICES) {
        expect(device.name).toBeTruthy();
        expect(typeof device.name).toBe('string');
        expect(device.id).toBeTruthy();
        expect(typeof device.id).toBe('string');
        expect(device.category).toBeTruthy();
      }
    });

    it('has a valid category', () => {
      const validCategories = new Set(['Keyboard', 'Mouse', 'Mousemat', 'Headset', 'Keypad', 'Misc']);
      for (const device of SUPPORTED_DEVICES) {
        expect(validCategories.has(device.category)).toBe(true);
      }
    });

    it('has a USB vendor:product ID format', () => {
      const idRegex = /^[0-9a-fA-F]{4}:[0-9a-fA-F]{4}$/;
      for (const device of SUPPORTED_DEVICES) {
        expect(device.id).toMatch(idRegex);
      }
    });

    it('has a name that is a non-empty string', () => {
      for (const device of SUPPORTED_DEVICES) {
        expect(device.name.length).toBeGreaterThan(0);
      }
    });
  });

  it('has no duplicate device IDs', () => {
    const ids = SUPPORTED_DEVICES.map((d) => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('has mostly unique device names', () => {
    const names = SUPPORTED_DEVICES.map((d) => d.name);
    const uniqueNames = new Set(names);
    // Allow a small number of duplicates (e.g. variant entries)
    expect(uniqueNames.size).toBeGreaterThan(names.length * 0.95);
  });

  it('contains specific well-known devices', () => {
    const names = SUPPORTED_DEVICES.map((d) => d.name);
    expect(names).toContain('Razer DeathAdder V2');
    expect(names).toContain('Razer BlackWidow Chroma');
  });

  describe('category distribution', () => {
    it('has devices in multiple categories', () => {
      const categories = new Set(SUPPORTED_DEVICES.map((d) => d.category));
      expect(categories.size).toBeGreaterThanOrEqual(3);
    });

    it('has both mice and keyboards', () => {
      const hasMouse = SUPPORTED_DEVICES.some((d) => d.category === 'Mouse');
      const hasKeyboard = SUPPORTED_DEVICES.some((d) => d.category === 'Keyboard');
      expect(hasMouse).toBe(true);
      expect(hasKeyboard).toBe(true);
    });
  });

  describe('optional fields', () => {
    it('programmableKeys is a non-negative number when present', () => {
      for (const device of SUPPORTED_DEVICES) {
        if (device.programmableKeys !== undefined) {
          expect(typeof device.programmableKeys).toBe('number');
          expect(device.programmableKeys).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('imageUrl is a valid URL when present', () => {
      for (const device of SUPPORTED_DEVICES) {
        if (device.imageUrl !== undefined) {
          expect(typeof device.imageUrl).toBe('string');
          expect(device.imageUrl.startsWith('http')).toBe(true);
        }
      }
    });
  });
});
