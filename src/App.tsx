import { useEffect, useMemo, useState } from 'react';
import devicesData from './data/devices.json';
import functionsData from './data/functions.json';
import { DeviceSidebar } from './components/DeviceSidebar';
import { DeviceViewport } from './components/DeviceViewport';
import { ConfigPanel } from './components/ConfigPanel';
import { Device, MappingConfig } from './components/types';

const svgModules = import.meta.glob('./assets/devices/**/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

type DevicesJson = { defaultDeviceId: string; devices: Device[] };

const { devices, defaultDeviceId } = devicesData as DevicesJson;
const allFunctions = (functionsData.categories as { name: string; functions: string[] }[]).flatMap((c) => c.functions);
const effectOptions = functionsData.lightingEffects as string[];

const blankConfig = (): MappingConfig => ({
  remaps: {},
  lighting: {},
  performance: {
    pollingRate: 1000,
    debounce: 2,
    dpiStages: [
      { value: 400, color: '#00ff41' },
      { value: 800, color: '#00ff41' },
      { value: 1600, color: '#00ff41' },
      { value: 3200, color: '#00ff41' },
      { value: 6400, color: '#00ff41' },
    ],
  },
  macros: [],
});

function getStorageKey(deviceId: string, profileId: number) {
  return `razer-config-${deviceId}-${profileId}`;
}

function resolveAsset(path: string) {
  const match = Object.entries(svgModules).find(([k]) => k.endsWith(path));
  return match?.[1] ?? '';
}

export default function App() {
  const [selectedDeviceId, setSelectedDeviceId] = useState(defaultDeviceId);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState(1);
  const [activeTab, setActiveTab] = useState('Customize');

  const selectedDevice = useMemo(() => devices.find((d) => d.id === selectedDeviceId)!, [selectedDeviceId]);
  const storeKey = getStorageKey(selectedDeviceId, activeProfile);
  const [config, setConfig] = useState<MappingConfig>(() => {
    const saved = localStorage.getItem(storeKey);
    return saved ? JSON.parse(saved) : blankConfig();
  });


  useEffect(() => {
    const saved = localStorage.getItem(storeKey);
    setConfig(saved ? JSON.parse(saved) : blankConfig());
  }, [storeKey]);

  const saveConfig = (next: MappingConfig) => {
    setConfig(next);
    localStorage.setItem(storeKey, JSON.stringify(next));
  };

  const resolvedDevice = { ...selectedDevice, asset: resolveAsset(selectedDevice.asset) };

  return (
    <main className="app-shell">
      <header className="header panel">
        <h1>RAZER CONFIGURATOR</h1>
        <div>Device: {selectedDevice.name}</div>
        <div>Profile {activeProfile}</div>
      </header>
      <div className="layout">
        <DeviceSidebar devices={devices} selectedDeviceId={selectedDeviceId} onSelect={(id) => { setSelectedDeviceId(id); setSelectedButton(null); }} />
        <DeviceViewport device={resolvedDevice} selectedButton={selectedButton} onSelectButton={setSelectedButton} activeTab={activeTab} onTabChange={setActiveTab} />
        <ConfigPanel
          device={resolvedDevice}
          selectedButton={selectedButton}
          activeTab={activeTab}
          config={config}
          functionOptions={allFunctions}
          effectOptions={effectOptions}
          activeProfile={activeProfile}
          setActiveProfile={setActiveProfile}
          onSetRemap={(buttonId, action) => saveConfig({ ...config, remaps: { ...config.remaps, [buttonId]: action } })}
          onSetLighting={(zone, patch) => saveConfig({ ...config, lighting: { ...config.lighting, [zone]: { color: '#00ff41', effect: 'Static', brightness: 100, ...(config.lighting[zone] ?? {}), ...patch } } })}
          onSetPerformance={(patch) => saveConfig({ ...config, performance: { ...config.performance, ...patch } })}
          onAddMacro={() => saveConfig({ ...config, macros: [...config.macros, { id: crypto.randomUUID(), name: `Macro ${config.macros.length + 1}`, steps: 'keydown:A (20ms)\nkeyup:A' }] })}
          onUpdateMacro={(id, steps) => saveConfig({ ...config, macros: config.macros.map((m) => (m.id === id ? { ...m, steps } : m)) })}
        />
      </div>
    </main>
  );
}
