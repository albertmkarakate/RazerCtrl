interface Props {
  activeProfile: number;
  onChange: (id: number) => void;
}

export function ProfileManager({ activeProfile, onChange }: Props) {
  return (
    <div>
      <h4>Profiles</h4>
      <div className="profile-grid">
        {[1,2,3,4,5].map((p) => (
          <button key={p} className={activeProfile === p ? 'tab active' : 'tab'} onClick={() => onChange(p)}>Profile {p}</button>
        ))}
      </div>
    </div>
  );
}
