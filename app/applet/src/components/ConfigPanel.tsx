import React from 'react';
import { RemapSelector } from './RemapSelector';

interface Props {
  device: any;
  activeTab: string;
  selectedHotspot: string | null;
}

export function ConfigPanel({ device, activeTab, selectedHotspot }: Props) {
  const hotspot = device.hotspots.find((h: any) => h.id === selectedHotspot);

  return (
    <div className="w-80 bg-[#1A1A1A] border-l border-[#2A2A2A] flex flex-col shrink-0">
      <div className="h-14 border-b border-[#2A2A2A] flex items-center px-6">
        <h2 className="font-display text-lg tracking-widest uppercase text-gray-200">
          {activeTab}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'Customize' && (
          <div>
            {selectedHotspot ? (
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Selected Button</div>
                  <div className="text-[#00FF41] font-display text-xl">{hotspot?.label}</div>
                </div>
                
                <RemapSelector hotspotId={selectedHotspot} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4 mt-20">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-600 rounded-full" />
                </div>
                <p className="text-sm">Select a button on the device<br/>to configure its mapping.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Lighting' && (
          <div className="text-gray-400 text-sm">
            Lighting configuration coming soon...
          </div>
        )}

        {activeTab === 'Performance' && (
          <div className="text-gray-400 text-sm">
            Performance configuration coming soon...
          </div>
        )}

        {activeTab === 'Macros' && (
          <div className="text-gray-400 text-sm">
            Macro editor coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
