interface Props {
  color: string;
  brightness: number;
  onColor: (hex: string) => void;
  onBrightness: (value: number) => void;
}

export function RGBPicker({ color, brightness, onColor, onBrightness }: Props) {
  return (
    <div className="rgb-picker">
      <label>Color</label>
      <input type="color" value={color} onChange={(e) => onColor(e.target.value)} className="control" />
      <label>Hex</label>
      <input value={color} onChange={(e) => onColor(e.target.value)} className="control" />
      <label>Brightness: {brightness}%</label>
      <input type="range" min={0} max={100} value={brightness} onChange={(e) => onBrightness(Number(e.target.value))} />
    </div>
  );
}
