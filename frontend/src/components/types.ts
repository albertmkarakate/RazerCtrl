export type DeviceCategory = 'Mouse' | 'Keyboard' | 'Keypad' | 'Headset' | 'Controller';

export interface Hotspot {
  id: string;
  x: number;
  y: number;
}

export interface Device {
  id: string;
  name: string;
  category: DeviceCategory;
  asset: string;
  lightingZones: string[];
  buttons: string[];
  hotspots: Hotspot[];
}

export interface MappingConfig {
  remaps: Record<string, string>;
  lighting: Record<string, { color: string; effect: string; brightness: number }>;
  performance: {
    pollingRate: number;
    debounce: number;
    dpiStages: { value: number; color: string }[];
  };
  macros: { id: string; name: string; steps: string }[];
}
