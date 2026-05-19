import { type ReactNode, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  Cpu,
  Fan,
  Gamepad2,
  Gauge,
  Headphones,
  Keyboard,
  Laptop,
  Mouse,
  Square,
  Sparkles,
  Zap,
} from 'lucide-react';

type TopTab =
  | 'Synapse'
  | 'System'
  | 'Mouse'
  | 'Audio'
  | 'Keyboard'
  | 'Profiles'
  | 'Apps'
  | 'Connect'
  | 'Studio'
  | 'Visualizer'
  | 'Macro';

type DeviceType = 'Laptop' | 'Mouse' | 'Keyboard' | 'Headset' | 'Keypad';

type Device = {
  name: string;
  type: DeviceType;
  status: 'online' | 'idle' | 'charging';
  battery: number;
  firmware: string;
  temp?: number;
};

const TOP_TABS: TopTab[] = [
  'Synapse',
  'System',
  'Mouse',
  'Audio',
  'Keyboard',
  'Profiles',
  'Apps',
  'Connect',
  'Studio',
  'Visualizer',
  'Macro',
];

const DEVICES: Device[] = [
  { name: 'Blade 18', type: 'Laptop', status: 'online', battery: 92, firmware: 'v3.1.7', temp: 49 },
  { name: 'Viper V3 Pro', type: 'Mouse', status: 'online', battery: 77, firmware: 'v2.8.2' },
  { name: 'BlackWidow V4 Pro', type: 'Keyboard', status: 'charging', battery: 64, firmware: 'v1.9.4' },
  { name: 'BlackShark V2 Pro', type: 'Headset', status: 'idle', battery: 53, firmware: 'v4.2.1' },
  { name: 'Tartarus Pro', type: 'Keypad', status: 'online', battery: 100, firmware: 'v2.0.5' },
];

const GAMES = [
  'Cyberpunk 2077',
  'Helldivers 2',
  'Valorant',
  'Baldur\'s Gate 3',
  'Elden Ring',
  'The Witcher 3',
  'Apex Legends',
  'DOOM Eternal',
];

function iconForDevice(type: DeviceType) {
  if (type === 'Laptop') return Laptop;
  if (type === 'Mouse') return Mouse;
  if (type === 'Keyboard') return Keyboard;
  if (type === 'Headset') return Headphones;
  return Gamepad2;
}

function cls(...classes: Array<string | false>) {
  return classes.filter(Boolean).join(' ');
}

function Surface({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cls(
        'rounded-2xl border border-white/10 bg-gradient-to-b from-[#1c1f23] to-[#14171a] shadow-[0_18px_45px_rgba(0,0,0,0.45)]',
        className,
      )}
    >
      {children}
    </section>
  );
}

function App() {
  const [activeTopTab, setActiveTopTab] = useState<TopTab>('Synapse');
  const [deviceSettingsTab, setDeviceSettingsTab] = useState<'Mouse' | 'Keyboard' | 'System'>('Mouse');
  const [lightingDirection, setLightingDirection] = useState<'Left' | 'Right'>('Right');
  const [selectedProfile, setSelectedProfile] = useState('Tournament');
  const [selectedGame, setSelectedGame] = useState(GAMES[0]);

  const activeDevice = useMemo(() => {
    if (activeTopTab === 'System') return DEVICES[0];
    if (activeTopTab === 'Mouse') return DEVICES[1];
    if (activeTopTab === 'Keyboard') return DEVICES[2];
    if (activeTopTab === 'Audio') return DEVICES[3];
    return DEVICES[0];
  }, [activeTopTab]);

  const page =
    activeTopTab === 'Profiles'
      ? 'profiles'
      : activeTopTab === 'Studio' || activeTopTab === 'Visualizer'
        ? 'lighting'
        : activeTopTab === 'Macro'
          ? 'macro'
          : activeTopTab === 'Synapse'
            ? 'dashboard'
            : 'device-settings';

  return (
    <div className="min-h-screen bg-[#0a0d10] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col px-4 py-4">
        <div className="relative flex min-h-[900px] flex-1 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#111418] shadow-[0_35px_120px_rgba(0,0,0,0.7)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(68,214,44,0.08),transparent_36%),radial-gradient(circle_at_70%_80%,rgba(84,104,255,0.08),transparent_34%)]" />

          <header className="z-10 flex h-16 items-center justify-between border-b border-white/10 bg-[#171b20]/95 px-6 backdrop-blur">
            <div className="flex items-center gap-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#44d62c]/20 text-[#44d62c]">
                <Zap size={16} />
              </div>
              <nav className="flex flex-wrap items-center gap-2 text-[12px] font-semibold tracking-[0.18em] text-zinc-400 uppercase">
                {TOP_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTopTab(tab);
                      if (tab === 'Mouse') setDeviceSettingsTab('Mouse');
                      if (tab === 'Keyboard') setDeviceSettingsTab('Keyboard');
                      if (tab === 'System') setDeviceSettingsTab('System');
                    }}
                    className={cls(
                      'rounded-lg px-3 py-1.5 transition-all duration-200 hover:text-zinc-100',
                      activeTopTab === tab && 'bg-[#44d62c] text-black shadow-[0_0_24px_rgba(68,214,44,0.55)]',
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3 text-zinc-400">
              <button className="rounded-md p-1.5 transition hover:bg-white/10 hover:text-[#44d62c]">
                <Sparkles size={16} />
              </button>
              <button className="rounded-md p-1.5 transition hover:bg-white/10 hover:text-zinc-100">
                <Square size={16} />
              </button>
              <button className="rounded-md p-1.5 transition hover:bg-white/10 hover:text-zinc-100">
                <Square size={16} />
              </button>
            </div>
          </header>

          <main className="z-10 flex flex-1 overflow-hidden p-4">
            {page === 'dashboard' && <DashboardView />}
            {page === 'device-settings' && (
              <DeviceSettingsView
                activeDevice={activeDevice}
                tab={deviceSettingsTab}
                onTabChange={setDeviceSettingsTab}
              />
            )}
            {page === 'profiles' && (
              <ProfilesView
                selectedProfile={selectedProfile}
                setSelectedProfile={setSelectedProfile}
                selectedGame={selectedGame}
                setSelectedGame={setSelectedGame}
              />
            )}
            {page === 'lighting' && (
              <LightingView direction={lightingDirection} onDirectionChange={setLightingDirection} />
            )}
            {page === 'macro' && <MacroView />}
          </main>
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  return (
    <div className="grid h-full w-full grid-cols-[1fr_360px] gap-4 overflow-hidden">
      <div className="space-y-4 overflow-auto pr-1">
        <Surface className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-zinc-300 uppercase">Connected Devices</h2>
            <span className="rounded-full border border-[#44d62c]/40 bg-[#44d62c]/10 px-3 py-1 text-xs text-[#75f05f]">
              5 Online
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 2xl:grid-cols-3">
            {DEVICES.map((device) => {
              const Icon = iconForDevice(device.type);
              return (
                <div
                  key={device.name}
                  className="group rounded-xl border border-white/10 bg-black/20 p-4 transition duration-200 hover:border-[#44d62c]/60 hover:shadow-[0_0_24px_rgba(68,214,44,0.25)]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-white/5 p-2 text-[#44d62c]">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{device.name}</p>
                        <p className="text-xs text-zinc-400">{device.type}</p>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-400">{device.firmware}</span>
                  </div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Battery</span>
                    <span>{device.battery}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-white/10">
                    <div className="h-full rounded bg-[#44d62c]" style={{ width: `${device.battery}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Surface>

        <div className="grid grid-cols-2 gap-4">
          <Surface className="p-5">
            <h3 className="mb-4 text-sm font-semibold tracking-[0.2em] text-zinc-300 uppercase">Modules</h3>
            <div className="space-y-3">
              {['Chroma Studio', 'Visualizer', 'Macro Engine', 'THX Spatial'].map((module) => (
                <div key={module} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                  <span>{module}</span>
                  <span className="rounded-full bg-[#44d62c]/15 px-2 py-0.5 text-xs text-[#7cee68]">Installed</span>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="p-5">
            <h3 className="mb-4 text-sm font-semibold tracking-[0.2em] text-zinc-300 uppercase">Services</h3>
            <div className="space-y-3">
              {[
                ['Cloud Sync', 'Connected'],
                ['Game Scanner', 'Running'],
                ['Profile Automation', 'Active'],
                ['Driver Updates', '2 pending'],
              ].map(([name, status]) => (
                <div key={name} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                  <p className="text-sm">{name}</p>
                  <p className="text-xs text-zinc-400">{status}</p>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </div>

      <Surface className="p-5">
        <h3 className="mb-4 text-sm font-semibold tracking-[0.2em] text-zinc-300 uppercase">Status Inspector</h3>
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/25 p-4">
            <div className="mb-2 flex items-center gap-2 text-[#44d62c]"><Gauge size={16} /> System Load</div>
            <div className="text-3xl font-semibold">63%</div>
            <p className="text-xs text-zinc-400">Optimal thermal envelope</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-black/25 p-3 text-center">
              <Cpu className="mx-auto mb-2 text-[#44d62c]" size={18} />
              <p className="text-2xl font-semibold">72°</p>
              <p className="text-xs text-zinc-400">CPU</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/25 p-3 text-center">
              <Fan className="mx-auto mb-2 text-[#44d62c]" size={18} />
              <p className="text-2xl font-semibold">3900</p>
              <p className="text-xs text-zinc-400">RPM</p>
            </div>
          </div>
          <div className="rounded-xl border border-[#44d62c]/30 bg-[#44d62c]/10 p-3 text-sm text-[#88f676]">
            Firmware updates available for BlackWidow V4 Pro.
          </div>
        </div>
      </Surface>
    </div>
  );
}

function DeviceSettingsView({
  activeDevice,
  tab,
  onTabChange,
}: {
  activeDevice: Device;
  tab: 'Mouse' | 'Keyboard' | 'System';
  onTabChange: (tab: 'Mouse' | 'Keyboard' | 'System') => void;
}) {
  return (
    <div className="grid h-full w-full grid-cols-[1fr_360px] gap-4 overflow-hidden">
      <div className="flex flex-col gap-4 overflow-auto pr-1">
        <div className="flex items-center gap-2">
          {(['Mouse', 'Keyboard', 'System'] as const).map((item) => (
            <button
              key={item}
              onClick={() => onTabChange(item)}
              className={cls(
                'rounded-lg px-4 py-2 text-sm font-semibold transition',
                tab === item ? 'bg-[#44d62c] text-black shadow-[0_0_20px_rgba(68,214,44,0.45)]' : 'bg-white/5 text-zinc-300 hover:bg-white/10',
              )}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === 'Mouse' && <MouseSettingsPanel />}
        {tab === 'Keyboard' && <KeyboardSettingsPanel />}
        {tab === 'System' && <SystemSettingsPanel />}
      </div>

      <RightInspector device={activeDevice} />
    </div>
  );
}

function MouseSettingsPanel() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Surface className="p-5">
        <h3 className="mb-4 text-sm tracking-[0.2em] text-zinc-300 uppercase">Mouse Performance</h3>
        <div className="space-y-4">
          <LabeledRange label="DPI X" value={1800} max={20000} />
          <LabeledRange label="DPI Y" value={1500} max={20000} />
          <LabeledRange label="Polling Rate (Hz)" value={1000} max={8000} />
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
          {[800, 1800, 4500, 9000, 12000].map((dpi, i) => (
            <button
              key={dpi}
              className={cls(
                'rounded-lg border px-2 py-2 transition',
                i === 1 ? 'border-[#44d62c] bg-[#44d62c]/20 text-[#8af476]' : 'border-white/10 bg-black/20 text-zinc-400 hover:border-[#44d62c]/40',
              )}
            >
              Stage {i + 1}\n{dpi}
            </button>
          ))}
        </div>
      </Surface>

      <Surface className="p-5">
        <h3 className="mb-4 text-sm tracking-[0.2em] text-zinc-300 uppercase">Power Management</h3>
        <div className="space-y-4 text-sm">
          <ControlRow label="Sleep after" value="10 min" />
          <ControlRow label="Low battery mode" value="20%" />
          <ControlRow label="Battery health" value="Excellent" />
          <div className="rounded-lg border border-[#44d62c]/30 bg-[#44d62c]/10 p-3 text-xs text-[#84f46f]">
            HyperSpeed paired with BlackWidow V4 Pro and Tartarus Pro.
          </div>
        </div>
      </Surface>
    </div>
  );
}

function KeyboardSettingsPanel() {
  return (
    <div className="grid grid-cols-[280px_1fr] gap-4">
      <Surface className="p-5">
        <h3 className="mb-4 text-sm tracking-[0.2em] text-zinc-300 uppercase">Game Mode</h3>
        <div className="space-y-3 text-sm">
          {['Disable Windows key', 'Disable Alt+Tab', 'Disable Alt+F4'].map((item) => (
            <label key={item} className="flex items-center gap-3 rounded-lg bg-black/20 px-3 py-2">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-[#44d62c] text-black"><Check size={14} /></span>
              {item}
            </label>
          ))}
        </div>
      </Surface>
      <Surface className="p-5">
        <h3 className="mb-4 text-sm tracking-[0.2em] text-zinc-300 uppercase">Key Remapping Matrix</h3>
        <div className="grid grid-cols-14 gap-1 rounded-xl border border-white/10 bg-black/25 p-3">
          {Array.from({ length: 84 }).map((_, i) => (
            <button
              key={i}
              className={cls(
                'h-8 rounded border text-[10px] transition',
                [17, 22, 43].includes(i)
                  ? 'border-[#44d62c] bg-[#44d62c]/25 text-[#95f685] shadow-[0_0_14px_rgba(68,214,44,0.45)]'
                  : 'border-white/10 bg-[#1a1f24] text-zinc-500 hover:border-[#44d62c]/40',
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function SystemSettingsPanel() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Surface className="p-5">
        <h3 className="mb-4 text-sm tracking-[0.2em] text-zinc-300 uppercase">System Performance</h3>
        <div className="grid grid-cols-3 gap-2">
          {['Silent', 'Balanced', 'Custom'].map((mode, idx) => (
            <button
              key={mode}
              className={cls(
                'rounded-xl border px-3 py-5 text-sm transition',
                idx === 1
                  ? 'border-[#44d62c] bg-[#44d62c]/20 text-[#8af476] shadow-[0_0_20px_rgba(68,214,44,0.3)]'
                  : 'border-white/10 bg-black/20 text-zinc-400 hover:border-[#44d62c]/50',
              )}
            >
              {mode}
            </button>
          ))}
        </div>
        <div className="mt-5 space-y-4">
          <LabeledRange label="Fan Speed" value={3900} max={5000} />
          <ControlRow label="Battery limit" value="80%" />
        </div>
      </Surface>
      <Surface className="p-5">
        <h3 className="mb-4 text-sm tracking-[0.2em] text-zinc-300 uppercase">Overclock Controls</h3>
        <div className="space-y-4">
          <LabeledRange label="Core Voltage Offset" value={-250} min={-500} max={500} />
          <LabeledRange label="Short-term Power Limit" value={160} min={1} max={200} />
          <LabeledRange label="Long-term Power Limit" value={120} min={1} max={190} />
        </div>
      </Surface>
    </div>
  );
}

function ProfilesView({
  selectedProfile,
  setSelectedProfile,
  selectedGame,
  setSelectedGame,
}: {
  selectedProfile: string;
  setSelectedProfile: (v: string) => void;
  selectedGame: string;
  setSelectedGame: (v: string) => void;
}) {
  return (
    <div className="grid h-full w-full grid-cols-[250px_1fr_350px] gap-4 overflow-hidden">
      <Surface className="p-4">
        <h3 className="mb-3 text-sm tracking-[0.2em] text-zinc-300 uppercase">Device Profiles</h3>
        <div className="space-y-2">
          {['Tournament', 'MMO', 'Streaming', 'Silent Night'].map((profile) => (
            <button
              key={profile}
              onClick={() => setSelectedProfile(profile)}
              className={cls(
                'w-full rounded-lg border px-3 py-2 text-left transition',
                selectedProfile === profile
                  ? 'border-[#44d62c] bg-[#44d62c]/20 text-[#92f67f]'
                  : 'border-white/10 bg-black/20 text-zinc-300 hover:border-[#44d62c]/40',
              )}
            >
              {profile}
            </button>
          ))}
        </div>
      </Surface>

      <Surface className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm tracking-[0.2em] text-zinc-300 uppercase">Linked Games</h3>
          <button className="rounded-lg bg-[#44d62c]/20 px-3 py-1 text-xs text-[#8ef579]">Assign</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {GAMES.map((game) => (
            <button
              key={game}
              onClick={() => setSelectedGame(game)}
              className={cls(
                'group rounded-xl border bg-gradient-to-b p-4 text-left transition duration-200',
                selectedGame === game
                  ? 'border-[#44d62c] from-[#233026] to-[#171b1f] shadow-[0_0_25px_rgba(68,214,44,0.3)]'
                  : 'border-white/10 from-[#1a1f24] to-[#15191d] hover:border-[#44d62c]/40',
              )}
            >
              <div className="mb-8 h-20 rounded-lg bg-black/30" />
              <p className="text-sm font-semibold">{game}</p>
              <p className="text-xs text-zinc-400">{Math.floor(Math.random() * 300 + 20)}h played</p>
            </button>
          ))}
        </div>
      </Surface>

      <Surface className="p-4">
        <h3 className="mb-3 text-sm tracking-[0.2em] text-zinc-300 uppercase">Assignment</h3>
        <div className="space-y-3 text-sm">
          <ControlRow label="Selected Game" value={selectedGame} />
          <ControlRow label="Active Profile" value={selectedProfile} />
          <ControlRow label="Auto Switch" value="Enabled" />
          <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-xs text-zinc-400">
            This profile will auto-load when {selectedGame} launches.
          </div>
        </div>
      </Surface>
    </div>
  );
}

function LightingView({
  direction,
  onDirectionChange,
}: {
  direction: 'Left' | 'Right';
  onDirectionChange: (d: 'Left' | 'Right') => void;
}) {
  return (
    <div className="grid h-full w-full grid-cols-[1fr_360px] gap-4 overflow-hidden">
      <div className="grid grid-cols-2 gap-4 overflow-auto pr-1">
        <Surface className="p-5">
          <h3 className="mb-4 text-sm tracking-[0.2em] text-zinc-300 uppercase">System Lighting</h3>
          <LabeledRange label="Brightness" value={68} max={100} />
          <div className="mt-5 space-y-3">
            {['Turn off when display is off', 'Turn off when idle for 10 min', 'Turn off below 20% battery'].map((item) => (
              <div key={item}>
                <ToggleRow label={item} />
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="p-5">
          <h3 className="mb-4 text-sm tracking-[0.2em] text-zinc-300 uppercase">Lighting Effect</h3>
          <div className="grid grid-cols-5 gap-2">
            {['Static', 'Wave', 'Ripple', 'Breathing', 'Reactive'].map((effect, idx) => (
              <button
                key={effect}
                className={cls(
                  'rounded-lg border px-2 py-3 text-xs transition',
                  idx === 1
                    ? 'border-[#44d62c] bg-[#44d62c]/20 text-[#89f475]'
                    : 'border-white/10 bg-black/20 text-zinc-400 hover:border-[#44d62c]/40',
                )}
              >
                {effect}
              </button>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            {(['Left', 'Right'] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => onDirectionChange(dir)}
                className={cls(
                  'flex-1 rounded-xl border px-4 py-3 transition',
                  direction === dir
                    ? 'border-[#44d62c] bg-[#44d62c]/20 text-[#8af476] shadow-[0_0_20px_rgba(68,214,44,0.35)]'
                    : 'border-white/10 bg-black/20 text-zinc-400 hover:border-[#44d62c]/40',
                )}
              >
                Direction {dir}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-[#44d62c]/30 bg-[#44d62c]/10 p-4">
            <p className="text-sm tracking-[0.18em] text-[#95f685] uppercase">Sync Across Devices</p>
            <p className="mb-3 text-xs text-zinc-300">Apply current effect to all compatible devices.</p>
            <button className="rounded-md bg-[#44d62c] px-3 py-1.5 text-sm font-semibold text-black">Sync Now</button>
          </div>
        </Surface>
      </div>
      <RightInspector device={DEVICES[0]} />
    </div>
  );
}

function MacroView() {
  const categories = ['Keyboard', 'Mouse', 'Macro', 'Shortcuts', 'Text'];
  const bindings = ['Q - Quick melee', 'E - Interact', 'F - Utility', 'Mouse5 - Push to talk', '1 - Heal Macro'];

  return (
    <div className="grid h-full w-full grid-cols-[1fr_360px] gap-4 overflow-hidden">
      <div className="grid grid-cols-[240px_1fr] gap-4 overflow-auto pr-1">
        <Surface className="p-4">
          <h3 className="mb-3 text-sm tracking-[0.2em] text-zinc-300 uppercase">Bindings</h3>
          <div className="space-y-2">
            {bindings.map((binding, idx) => (
              <button
                key={binding}
                className={cls(
                  'w-full rounded-lg border px-3 py-2 text-left text-sm transition',
                  idx === 1
                    ? 'border-[#44d62c] bg-[#44d62c]/20 text-[#8df578]'
                    : 'border-white/10 bg-black/20 text-zinc-300 hover:border-[#44d62c]/40',
                )}
              >
                {binding}
              </button>
            ))}
          </div>
        </Surface>

        <Surface className="p-5">
          <h3 className="mb-4 text-sm tracking-[0.2em] text-zinc-300 uppercase">Macro / Keybinding Editor</h3>
          <div className="grid grid-cols-15 gap-1 rounded-xl border border-white/10 bg-black/25 p-3 [grid-template-columns:repeat(15,minmax(0,1fr))]">
            {Array.from({ length: 90 }).map((_, i) => (
              <button
                key={i}
                className={cls(
                  'h-9 rounded border text-[10px] transition',
                  [27, 28, 31, 45, 58].includes(i)
                    ? 'border-[#44d62c] bg-[#44d62c]/20 text-[#8cf578] shadow-[0_0_16px_rgba(68,214,44,0.4)]'
                    : 'border-white/10 bg-[#1b2025] text-zinc-500 hover:border-[#44d62c]/40',
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </Surface>
      </div>

      <Surface className="p-5">
        <h3 className="mb-4 text-sm tracking-[0.2em] text-zinc-300 uppercase">Remap Panel</h3>
        <div className="space-y-2">
          {categories.map((category, idx) => (
            <button
              key={category}
              className={cls(
                'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition',
                idx === 0
                  ? 'border-[#44d62c] bg-[#44d62c]/15 text-[#8ef579]'
                  : 'border-white/10 bg-black/20 text-zinc-300 hover:border-[#44d62c]/40',
              )}
            >
              {category}
              <ChevronDown size={14} className="text-zinc-400" />
            </button>
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-zinc-300">
          <p className="mb-2 text-xs tracking-[0.18em] text-zinc-400 uppercase">Selected Binding</p>
          <p className="text-[#90f67f]">E → Launch Application (Steam)</p>
        </div>
      </Surface>
    </div>
  );
}

function RightInspector({ device }: { device: Device }) {
  const Icon = iconForDevice(device.type);

  return (
    <Surface className="p-5">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#44d62c]/15 p-2 text-[#44d62c]">
            <Icon size={18} />
          </div>
          <div>
            <p className="font-semibold">{device.name}</p>
            <p className="text-xs text-zinc-400">{device.type}</p>
          </div>
        </div>
        <span className="rounded-md bg-[#44d62c]/20 px-2 py-1 text-xs text-[#8ff67a]">{device.firmware}</span>
      </div>

      <div className="space-y-4 text-sm">
        <ControlRow label="Profile" value="Default" />
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Battery</span>
            <span>{device.battery}%</span>
          </div>
          <div className="h-2 rounded bg-white/10">
            <div className="h-full rounded bg-[#44d62c]" style={{ width: `${device.battery}%` }} />
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="mb-2 text-xs tracking-[0.18em] text-zinc-400 uppercase">Temperatures</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-black/25 p-2 text-center">
              <p className="text-2xl font-semibold">42°</p>
              <p className="text-xs text-zinc-400">CPU</p>
            </div>
            <div className="rounded-lg bg-black/25 p-2 text-center">
              <p className="text-2xl font-semibold">39°</p>
              <p className="text-xs text-zinc-400">GPU</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#44d62c]/30 bg-[#44d62c]/10 px-3 py-2 text-[#92f67e]">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em]">
            <Check size={14} /> Firmware up to date
          </div>
        </div>
      </div>
    </Surface>
  );
}

function ToggleRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm">
      <span>{label}</span>
      <span className="relative inline-flex h-6 w-11 rounded-full bg-[#44d62c]/80 p-0.5">
        <span className="h-5 w-5 translate-x-5 rounded-full bg-white" />
      </span>
    </div>
  );
}

function ControlRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
      <span className="text-zinc-300">{label}</span>
      <button className="flex items-center gap-2 rounded-md bg-white/5 px-2 py-1 text-zinc-200">
        {value} <ChevronDown size={14} className="text-zinc-500" />
      </button>
    </div>
  );
}

function LabeledRange({
  label,
  value,
  min = 0,
  max,
}: {
  label: string;
  value: number;
  min?: number;
  max: number;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-zinc-300">{label}</span>
        <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{value}</span>
      </div>
      <div className="h-2 rounded bg-white/10">
        <div className="h-full rounded bg-[#44d62c] shadow-[0_0_12px_rgba(68,214,44,0.7)]" style={{ width: `${percentage}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export default App;
