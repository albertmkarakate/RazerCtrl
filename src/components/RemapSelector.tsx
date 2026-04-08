interface Props {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function RemapSelector({ options, value, onChange }: Props) {
  return (
    <select className="control" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}
