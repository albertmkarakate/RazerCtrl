interface Props {
  effects: string[];
  value: string;
  onChange: (value: string) => void;
}

export function EffectSelector({ effects, value, onChange }: Props) {
  return <select className="control" value={value} onChange={(e) => onChange(e.target.value)}>{effects.map((e) => <option key={e}>{e}</option>)}</select>;
}
