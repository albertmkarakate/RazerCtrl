import React, { useState } from 'react';
import devicesData from './data/devices.json';
import { DeviceSidebar } from './components/DeviceSidebar';
import { DeviceViewport } from './components/DeviceViewport';
import { ConfigPanel } from './components/ConfigPanel';

export default function App() {
  const [selectedDevice, setSelectedDevice] = useState(devicesData[0]);
  const [activeTab, setActiveTab] = useState('Customize');
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-[#2A2A2A] bg-[#1A1A1A] flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-[#00FF41] font-display font-bold text-xl tracking-wider">RAZERCTRL</div>
          <div className="w-px h-6 bg-[#2A2A2A] mx-2"></div>
          <div className="font-display text-lg text-gray-300">{selectedDevice.name}</div>
        </div>
        <div className="flex items-center gap-4">
          <select className="bg-[#0D0D0D] border border-[#2A2A2A] text-sm px-3 py-1.5 rounded text-gray-300 outline-none focus:border-[#00FF41] font-display">
            <option>Profile 1</option>
            <option>Profile 2</option>
            <option>Profile 3</option>
          </select>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        <DeviceSidebar 
          devices={devicesData} 
          selectedDevice={selectedDevice} 
          onSelectDevice={(d) => { setSelectedDevice(d); setSelectedHotspot(null); }} 
        />
        
        <div className="flex-1 flex flex-col relative bg-[#0D0D0D]">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-8 pt-6 pb-2 z-10">
            {['Customize', 'Lighting', 'Performance', 'Macros'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-display text-lg tracking-widest uppercase pb-2 border-b-2 transition-colors ${activeTab === tab ? 'border-[#00FF41] text-[#00FF41]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <DeviceViewport 
            device={selectedDevice} 
            activeTab={activeTab}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={setSelectedHotspot}
          />
        </div>

        <ConfigPanel 
          device={selectedDevice}
          activeTab={activeTab}
          selectedHotspot={selectedHotspot}
        />
      </div>
    </div>
  );
}
