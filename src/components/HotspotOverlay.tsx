import React from 'react';

interface Hotspot {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Props {
  hotspots: Hotspot[];
  selectedHotspot: string | null;
  onSelectHotspot: (id: string | null) => void;
}

export function HotspotOverlay({ hotspots, selectedHotspot, onSelectHotspot }: Props) {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {hotspots.map(hotspot => {
        const isSelected = selectedHotspot === hotspot.id;
        return (
          <div
            key={hotspot.id}
            className="absolute pointer-events-auto cursor-pointer flex items-center justify-center group"
            style={{ 
              left: `${hotspot.x}%`, 
              top: `${hotspot.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => onSelectHotspot(hotspot.id)}
          >
            {/* Glow effect when selected */}
            {isSelected && (
              <div className="absolute w-8 h-8 bg-[#00FF41] rounded-full opacity-20 animate-ping" />
            )}
            
            {/* Hotspot Circle */}
            <div 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 
                ${isSelected 
                  ? 'border-[#00FF41] bg-[#00FF41] scale-125 shadow-[0_0_10px_#00FF41]' 
                  : 'border-[#00FF41] bg-transparent group-hover:bg-[#00FF41]/50'
                }`}
            />
            
            {/* Label (visible on hover or selected) */}
            <div className={`absolute left-6 whitespace-nowrap px-2 py-1 bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-display tracking-wider rounded transition-opacity duration-200
              ${isSelected ? 'opacity-100 text-[#00FF41] border-[#00FF41]/50' : 'opacity-0 group-hover:opacity-100 text-gray-300'}
            `}>
              {hotspot.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
