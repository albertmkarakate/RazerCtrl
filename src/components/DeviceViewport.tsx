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

  useEffect(() => {
    fetch(device.svgUrl)
      .then(res => res.text())
      .then(text => {
        // We inject the SVG content directly to allow CSS styling of strokes
        setSvgContent(text);
      })
      .catch(err => console.error("Failed to load SVG", err));
  }, [device.svgUrl]);

  return (
    <div className="flex-1 flex items-center justify-center p-12 relative">
      <div className="relative w-full max-w-3xl aspect-video flex items-center justify-center">
        {/* SVG Container */}
        <div 
          className="w-full h-full absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            color: activeTab === 'Lighting' ? '#333' : 'rgba(0, 255, 65, 0.2)', // Idle state color
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        
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
