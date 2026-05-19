import { Device } from './types';
import { HotspotOverlay } from './HotspotOverlay';

interface Props {
  device: Device;
  selectedButton: string | null;
  onSelectButton: (buttonId: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ['Customize', 'Lighting', 'Performance', 'Macros', 'Profiles'];

export function DeviceViewport({ device, selectedButton, onSelectButton, activeTab, onTabChange }: Props) {
  return (
    <section className="viewport panel">
      <div className="tabs">
        {tabs.map((tab) => (
          <button key={tab} className={activeTab === tab ? 'tab active' : 'tab'} onClick={() => onTabChange(tab)}>{tab}</button>
        ))}
      </div>
      <div className="svg-stage">
        <img src={device.asset} alt={device.name} className="device-svg" />
        <HotspotOverlay hotspots={device.hotspots} selectedButton={selectedButton} onSelect={onSelectButton} />
      </div>
    </section>
  );
}
