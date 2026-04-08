import { Device, MappingConfig } from './types';
import { RemapSelector } from './RemapSelector';
import { RGBPicker } from './RGBPicker';
import { EffectSelector } from './EffectSelector';
import { DPIEditor } from './DPIEditor';
import { MacroEditor } from './MacroEditor';
import { ProfileManager } from './ProfileManager';

interface Props {
  device: Device;
  selectedButton: string | null;
  activeTab: string;
  config: MappingConfig;
  functionOptions: string[];
  effectOptions: string[];
  activeProfile: number;
  setActiveProfile: (p: number) => void;
  onSetRemap: (buttonId: string, action: string) => void;
  onSetLighting: (zone: string, patch: { color?: string; effect?: string; brightness?: number }) => void;
  onSetPerformance: (patch: Partial<MappingConfig['performance']>) => void;
  onAddMacro: () => void;
  onUpdateMacro: (id: string, steps: string) => void;
}

export function ConfigPanel(props: Props) {
  const {
    device, selectedButton, activeTab, config, functionOptions, effectOptions, activeProfile, setActiveProfile,
    onSetRemap, onSetLighting, onSetPerformance, onAddMacro, onUpdateMacro,
  } = props;

  const targetZone = device.lightingZones[0] ?? 'default';
  const light = config.lighting[targetZone] ?? { color: '#00ff41', effect: 'Static', brightness: 100 };

  return (
    <aside className="config panel">
      <h3>{device.name}</h3>
      {activeTab === 'Customize' && (
        <>
          <p>Selected: <b>{selectedButton ?? 'None'}</b></p>
          {selectedButton && (
            <RemapSelector options={functionOptions} value={config.remaps[selectedButton] ?? 'Passthrough'} onChange={(v) => onSetRemap(selectedButton, v)} />
          )}
        </>
      )}
      {activeTab === 'Lighting' && (
        <>
          <label>Zone</label>
          <select className="control" value={targetZone} onChange={(e) => onSetLighting(e.target.value, {})}>{device.lightingZones.map((z) => <option key={z}>{z}</option>)}</select>
          <RGBPicker color={light.color} brightness={light.brightness} onColor={(c) => onSetLighting(targetZone, { color: c })} onBrightness={(b) => onSetLighting(targetZone, { brightness: b })} />
          <label>Effect</label>
          <EffectSelector effects={effectOptions} value={light.effect} onChange={(e) => onSetLighting(targetZone, { effect: e })} />
        </>
      )}
      {activeTab === 'Performance' && (
        <DPIEditor
          dpiStages={config.performance.dpiStages}
          pollingRate={config.performance.pollingRate}
          debounce={config.performance.debounce}
          onChangeStage={(idx, value) => {
            const stages = [...config.performance.dpiStages];
            stages[idx] = { ...stages[idx], value };
            onSetPerformance({ dpiStages: stages });
          }}
          onPollingRate={(v) => onSetPerformance({ pollingRate: v })}
          onDebounce={(v) => onSetPerformance({ debounce: v })}
        />
      )}
      {activeTab === 'Macros' && <MacroEditor macros={config.macros} onAdd={onAddMacro} onUpdate={onUpdateMacro} />}
      {activeTab === 'Profiles' && <ProfileManager activeProfile={activeProfile} onChange={setActiveProfile} />}
    </aside>
  );
}
