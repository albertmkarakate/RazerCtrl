interface Props {
  dpiStages: { value: number; color: string }[];
  pollingRate: number;
  debounce: number;
  onChangeStage: (idx: number, value: number) => void;
  onPollingRate: (value: number) => void;
  onDebounce: (value: number) => void;
}

export function DPIEditor({ dpiStages, pollingRate, debounce, onChangeStage, onPollingRate, onDebounce }: Props) {
  return (
    <div>
      <h4>DPI Stages</h4>
      {dpiStages.map((stage, i) => (
        <label key={i} className="row">Stage {i + 1}
          <input className="control" type="number" min={100} max={30000} value={stage.value} onChange={(e) => onChangeStage(i, Number(e.target.value))} />
        </label>
      ))}
      <label className="row">Polling Rate
        <select className="control" value={pollingRate} onChange={(e) => onPollingRate(Number(e.target.value))}>
          {[125, 500, 1000, 2000, 4000, 8000].map((p) => <option key={p} value={p}>{p} Hz</option>)}
        </select>
      </label>
      <label className="row">Debounce (ms)
        <input className="control" type="number" min={0} max={30} value={debounce} onChange={(e) => onDebounce(Number(e.target.value))} />
      </label>
    </div>
  );
}
