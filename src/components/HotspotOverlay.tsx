import { Hotspot } from './types';

interface Props {
  hotspots: Hotspot[];
  selectedButton: string | null;
  onSelect: (buttonId: string) => void;
}

export function HotspotOverlay({ hotspots, selectedButton, onSelect }: Props) {
  return (
    <div className="hotspot-layer">
      {hotspots.map((spot) => (
        <button
          key={spot.id}
          className={selectedButton === spot.id ? 'hotspot active' : 'hotspot'}
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          onClick={() => onSelect(spot.id)}
          title={spot.id}
        />
      ))}
    </div>
  );
}
