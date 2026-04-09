import React from 'react';
import { RemapSelector } from './RemapSelector';

interface Props {
  device: any;
  activeTab: string;
  selectedHotspot: string | null;
}

export function ConfigPanel({ device, activeTab, selectedHotspot }: Props) {
  const hotspot = device.hotspots.find((h: any) => h.id === selectedHotspot);
  const capabilities = device.capabilities || {};

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
          <div className="space-y-6">
            {capabilities.lighting ? (
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Lighting Effects</div>
                <div className="space-y-2">
                  {capabilities.lighting.map((effect: string) => (
                    <button key={effect} className="w-full text-left px-4 py-3 bg-[#2A2A2A] hover:bg-[#333333] border border-transparent hover:border-[#00FF41] rounded transition-colors text-sm text-gray-300">
                      {effect}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic">Lighting not supported on this device.</div>
            )}
          </div>
        )}

        {activeTab === 'Performance' && (
          <div className="space-y-6">
            {capabilities.performance ? (
              <>
                {capabilities.performance.dpi && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">DPI Stages ({capabilities.performance.dpi.stages})</div>
                    <div className="bg-[#2A2A2A] p-4 rounded border border-[#333333]">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Min: {capabilities.performance.dpi.min}</span>
                        <span>Max: {capabilities.performance.dpi.max}</span>
                      </div>
                      <input type="range" min={capabilities.performance.dpi.min} max={capabilities.performance.dpi.max} className="w-full accent-[#00FF41]" />
                    </div>
                  </div>
                )}
                
                {capabilities.performance.pollingRate && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Polling Rate (Hz)</div>
                    <select className="w-full bg-[#2A2A2A] border border-[#333333] text-gray-300 rounded px-3 py-2 outline-none focus:border-[#00FF41]">
                      {capabilities.performance.pollingRate.map((rate: number) => (
                        <option key={rate} value={rate}>{rate} Hz</option>
                      ))}
                    </select>
                  </div>
                )}

                {capabilities.performance.audio && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Audio Profile</div>
                    <select className="w-full bg-[#2A2A2A] border border-[#333333] text-gray-300 rounded px-3 py-2 outline-none focus:border-[#00FF41]">
                      {capabilities.performance.audio.map((profile: string) => (
                        <option key={profile} value={profile}>{profile}</option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500 text-sm italic">Performance settings not available for this device.</div>
            )}
          </div>
        )}

        {activeTab === 'Macros' && (
          <div className="space-y-4">
            <button className="w-full py-2 bg-[#00FF41] text-black font-medium rounded hover:bg-[#00CC33] transition-colors">
              Record New Macro
            </button>
            <div className="text-gray-500 text-sm text-center mt-4">
              No macros recorded yet.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
