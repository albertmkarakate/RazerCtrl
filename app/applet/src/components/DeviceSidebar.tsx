import React from 'react';

interface Device {
  id: string;
  name: string;
  category: string;
  svgUrl: string;
  hotspots: any[];
}

interface Props {
  devices: Device[];
  selectedDevice: Device;
  onSelectDevice: (device: Device) => void;
}

export function DeviceSidebar({ devices, selectedDevice, onSelectDevice }: Props) {
  const categories = Array.from(new Set(devices.map(d => d.category)));

  return (
    <div className="w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] flex flex-col overflow-y-auto shrink-0">
      <div className="p-4 font-display text-gray-500 tracking-widest text-sm uppercase border-b border-[#2A2A2A]">
        Devices
      </div>
      <div className="flex-1 py-2">
        {categories.map(category => (
          <div key={category} className="mb-4">
            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              {category}
            </div>
            {devices.filter(d => d.category === category).map(device => (
              <button
                key={device.id}
                onClick={() => onSelectDevice(device)}
                className={`w-full text-left px-6 py-2 text-sm transition-colors flex items-center gap-3
                  ${selectedDevice.id === device.id 
                    ? 'text-[#00FF41] bg-[#00FF41]/10 border-l-2 border-[#00FF41]' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-l-2 border-transparent'
                  }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${selectedDevice.id === device.id ? 'bg-[#00FF41]' : 'bg-gray-600'}`} />
                {device.name.replace('Razer ', '')}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
