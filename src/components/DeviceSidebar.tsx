import { Device, DeviceCategory } from './types';

const CATEGORIES: DeviceCategory[] = ['Mouse', 'Keyboard', 'Keypad', 'Headset', 'Controller'];

interface Props {
  devices: Device[];
  selectedDeviceId: string;
  onSelect: (id: string) => void;
}

export function DeviceSidebar({ devices, selectedDeviceId, onSelect }: Props) {
  return (
    <aside className="sidebar panel">
      {CATEGORIES.map((category) => {
        const grouped = devices.filter((d) => d.category === category);
        return (
          <section key={category} className="sidebar-group">
            <h3>{category}</h3>
            {grouped.map((d) => (
              <button
                key={d.id}
                className={selectedDeviceId === d.id ? 'device-row active' : 'device-row'}
                onClick={() => onSelect(d.id)}
              >
                {d.name}
              </button>
            ))}
          </section>
        );
      })}
    </aside>
  );
}
