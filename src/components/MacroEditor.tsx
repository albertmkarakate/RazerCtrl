interface Props {
  macros: { id: string; name: string; steps: string }[];
  onAdd: () => void;
  onUpdate: (id: string, steps: string) => void;
}

export function MacroEditor({ macros, onAdd, onUpdate }: Props) {
  return (
    <div>
      <button className="control" onClick={onAdd}>+ Create Macro</button>
      {macros.map((m) => (
        <div key={m.id} className="macro-card">
          <strong>{m.name}</strong>
          <textarea className="control" rows={3} value={m.steps} onChange={(e) => onUpdate(m.id, e.target.value)} />
        </div>
      ))}
    </div>
  );
}
