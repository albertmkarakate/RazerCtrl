import React, { useEffect, useState } from 'react';
import { HotspotOverlay } from './HotspotOverlay';

interface Props {
  device: any;
  activeTab: string;
  selectedHotspot: string | null;
  onSelectHotspot: (id: string | null) => void;
}

export function DeviceViewport({ device, activeTab, selectedHotspot, onSelectHotspot }: Props) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [svgError, setSvgError] = useState(false);

  useEffect(() => {
    setSvgContent('');
    setSvgError(false);
    fetch(device.svgUrl)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.text();
      })
      .then(text => {
        const trimmed = text.trim();
        if (!trimmed.startsWith('<svg') && !trimmed.includes('<svg ')) {
          throw new Error('not svg');
        }
        setSvgContent(trimmed);
      })
      .catch(() => setSvgError(true));
  }, [device.svgUrl]);

  return (
    <div className="flex-1 flex items-center justify-center p-12 relative">
      <div className="relative w-full max-w-3xl aspect-video flex items-center justify-center">
        {/* SVG Container */}
        {svgError ? (
          <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-3">
            <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center bg-white/[0.02]">
              <div className="text-white/30 text-5xl font-display font-black select-none">{device.category[0]}</div>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-white/40">{device.name.replace('Razer ', '')}</div>
            <div className="text-[9px] text-white/20 uppercase tracking-widest">SVG not found — add to /src/assets/devices/</div>
          </div>
        ) : (
          <div
            className="w-full h-full absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ color: activeTab === 'Lighting' ? '#333' : 'rgba(0, 255, 65, 0.2)' }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
        
        {/* Hotspots Overlay */}
        {activeTab === 'Customize' && (
          <HotspotOverlay 
            hotspots={device.hotspots} 
            selectedHotspot={selectedHotspot}
            onSelectHotspot={onSelectHotspot}
          />
        )}
      </div>
    </div>
  );
}
