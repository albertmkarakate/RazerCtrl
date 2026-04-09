import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  MousePointer2, 
  Keyboard, 
  Headphones, 
  Monitor, 
  Settings, 
  Zap, 
  Palette, 
  Layers, 
  Cpu,
  Battery,
  Wifi,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Bell,
  User,
  Power,
  Volume2,
  Mic2,
  Activity,
  Gamepad2,
  Plus,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Lock,
  Layers3,
  Link2,
  Play,
  Save,
  SlidersHorizontal,
  Sparkles,
  SplitSquareHorizontal,
  Trash2,
  Unlink,
  Flame,
  Bolt,
  Waves,
  Minus,
  Settings2
} from 'lucide-react';
import devicesData from './data/devices.json';

// --- Types ---
type ViewType = 'Dashboard' | 'Mouse' | 'Keyboard' | 'Audio' | 'System' | 'Profiles' | 'Studio' | 'Macro';

// --- Mock Data ---
const CONNECTED_DEVICES = [
  { id: 'viper', name: 'VIPER ULTIMATE', type: 'Mouse', battery: 77, image: 'https://picsum.photos/seed/mouse/400/400' },
  { id: 'blackwidow', name: 'BLACKWIDOW V3 PRO', type: 'Keyboard', battery: 12, image: 'https://picsum.photos/seed/keyboard/400/400' },
  { id: 'blackshark', name: 'BLACKSHARK V2 PRO', type: 'Headset', battery: 64, image: 'https://picsum.photos/seed/headset/400/400' },
  { id: 'blade', name: 'BLADE 18', type: 'System', battery: 100, image: 'https://picsum.photos/seed/laptop/400/400' },
];

// --- Components ---

const GlassCard = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void, key?: React.Key }) => (
  <div 
    onClick={onClick}
    className={`glass-card p-6 transition-all duration-300 hover:border-acid/20 group cursor-pointer ${className}`}
  >
    {children}
  </div>
);

const NeonToggle = ({ active, onClick }: { active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${active ? 'bg-acid' : 'bg-border'}`}
  >
    <motion.div 
      animate={{ x: active ? 20 : 2 }}
      className={`absolute top-1 w-3 h-3 rounded-full transition-colors duration-300 ${active ? 'bg-charcoal' : 'bg-white/40'}`}
    />
  </button>
);

const AcidSlider = ({ value, onChange, label, min = 0, max = 100 }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{label}</span>
      <span className="text-xs font-mono text-acid">{value}%</span>
    </div>
    <div className="relative h-1 bg-border rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className="absolute top-0 left-0 h-full bg-acid shadow-[0_0_10px_rgba(0,255,65,0.5)]"
      />
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${active ? 'bg-acid/10 text-acid' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
  >
    <Icon size={20} className={active ? 'drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]' : ''} />
    <span className="font-display font-medium text-sm tracking-wide">{label}</span>
    {active && <motion.div layoutId="sidebar-active" className="ml-auto w-1 h-4 bg-acid rounded-full shadow-neon" />}
  </button>
);

// --- Views ---

const DashboardView = ({ onDeviceClick }: { onDeviceClick: (type: ViewType) => void }) => (
  <div className="space-y-8 p-8">
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">DASHBOARD</h1>
        <p className="text-white/40 text-sm mt-1">Manage your connected hardware ecosystem</p>
      </div>
      <div className="flex gap-4">
        <button className="px-4 py-2 rounded-lg bg-surface border border-border text-xs font-bold uppercase tracking-widest hover:border-acid/50 transition-colors">Modules</button>
        <button className="px-4 py-2 rounded-lg bg-surface border border-border text-xs font-bold uppercase tracking-widest hover:border-acid/50 transition-colors">Global Shortcuts</button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {CONNECTED_DEVICES.map((device) => (
        <GlassCard key={device.id} onClick={() => onDeviceClick(device.type as ViewType)}>
          <div className="flex justify-between items-start mb-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{device.type}</div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-acid">
              <Battery size={12} />
              {device.battery}%
            </div>
          </div>
          <div className="aspect-square relative mb-6 overflow-hidden rounded-lg bg-charcoal/50 border border-white/5">
            <img 
              src={device.image} 
              alt={device.name} 
              className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent opacity-60" />
          </div>
          <h3 className="font-display font-bold text-lg tracking-wide group-hover:text-acid transition-colors">{device.name}</h3>
          <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
            <Wifi size={10} />
            Wireless Mode Active
          </div>
        </GlassCard>
      ))}
      <button className="glass-card border-dashed border-white/10 flex flex-col items-center justify-center gap-4 text-white/20 hover:text-acid hover:border-acid/30 transition-all duration-300">
        <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
          <Plus size={24} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest">Add Device</span>
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <GlassCard className="lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display font-bold uppercase tracking-widest text-sm">System Performance</h3>
          <Activity size={16} className="text-acid" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'CPU Temp', value: '42Â°C', sub: 'Last 1h avg: 81Â°' },
            { label: 'GPU Temp', value: '39Â°C', sub: 'Last 1h avg: 75Â°' },
            { label: 'Fan Speed', value: '3900', sub: 'RPM (Manual)' },
            { label: 'Power Mode', value: 'Boost', sub: 'Plugged In' },
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
              <div className="text-2xl font-display font-bold text-acid">{stat.value}</div>
              <div className="text-[10px] text-white/20 font-medium">{stat.sub}</div>
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display font-bold uppercase tracking-widest text-sm">Active Profile</h3>
          <Layers size={16} className="text-acid" />
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-acid/20 flex items-center justify-center text-acid">
              <Gamepad2 size={20} />
            </div>
            <div>
              <div className="text-xs font-bold">CYBERPUNK 2077</div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest">Gaming Preset v2.4</div>
            </div>
          </div>
          <button className="w-full py-3 rounded-lg bg-acid text-charcoal font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all">Switch Profile</button>
        </div>
      </GlassCard>
    </div>
  </div>
);

const AudioView = () => (
  <div className="p-8 space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">AUDIO</h1>
        <p className="text-white/40 text-sm mt-1">Mixer and enhancement controls</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <GlassCard className="lg:col-span-2 space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Mixer</h3>
          <Volume2 size={16} className="text-acid" />
        </div>
        <div className="space-y-6">
          {[
            { label: 'Master Volume', value: 80 },
            { label: 'Game', value: 100 },
            { label: 'Chat', value: 60 },
            { label: 'System', value: 40 },
          ].map((v, i) => (
            <AcidSlider key={i} label={v.label} value={v.value} onChange={() => {}} />
          ))}
        </div>
      </GlassCard>
      <GlassCard className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Enhancements</h3>
          <Zap size={16} className="text-acid" />
        </div>
        <div className="space-y-4">
          {[
            'THX Spatial Audio',
            'Bass Boost',
            'Sound Normalization',
            'Voice Clarity',
          ].map((e, i) => (
            <div key={i} className="flex justify-between items-center p-4 rounded-lg bg-surface border border-border">
              <span className="text-xs font-bold">{e}</span>
              <NeonToggle active={i < 2} onClick={() => {}} />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  </div>
);

const SystemView = () => (
  <div className="p-8 space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">SYSTEM</h1>
        <p className="text-white/40 text-sm mt-1">Laptop performance and display settings</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Power Mode</h3>
          <Cpu size={16} className="text-acid" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['Silent', 'Balanced', 'Boost'].map((mode, i) => (
            <button 
              key={i}
              className={`p-6 rounded-xl border flex flex-col items-center gap-4 transition-all ${mode === 'Boost' ? 'bg-acid/10 border-acid text-acid shadow-neon' : 'bg-surface border-border text-white/20 hover:border-white/20'}`}
            >
              <Zap size={24} />
              <span className="text-xs font-bold uppercase tracking-widest">{mode}</span>
            </button>
          ))}
        </div>
        <div className="pt-8 border-t border-border space-y-6">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Manual Overclocking</h4>
          <AcidSlider label="Core Voltage Offset" value={20} onChange={() => {}} />
          <AcidSlider label="Power Limit" value={85} onChange={() => {}} />
        </div>
      </GlassCard>

      <GlassCard className="space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Display Settings</h3>
          <Monitor size={16} className="text-acid" />
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Refresh Rate</label>
            <div className="flex gap-2">
              {['60 Hz', '120 Hz', '240 Hz'].map((rate, i) => (
                <button key={i} className={`flex-1 py-3 rounded-lg border text-xs font-bold transition-all ${rate === '240 Hz' ? 'bg-acid/10 border-acid text-acid' : 'bg-surface border-border text-white/20'}`}>
                  {rate}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center p-4 rounded-lg bg-surface border border-border">
            <div className="space-y-1">
              <span className="text-xs font-bold">NVIDIA Advanced Optimus</span>
              <p className="text-[10px] text-white/40">Automatic GPU switching</p>
            </div>
            <NeonToggle active={true} onClick={() => {}} />
          </div>
          <div className="pt-8 border-t border-border space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Battery Health</h4>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold">Limit Charge to 80%</span>
              <NeonToggle active={true} onClick={() => {}} />
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  </div>
);

const ProfilesView = () => (
  <div className="p-8 space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">PROFILES</h1>
        <p className="text-white/40 text-sm mt-1">Link games and manage device assignments</p>
      </div>
      <button className="px-6 py-2 rounded-lg bg-acid text-charcoal font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2">
        <Plus size={16} />
        Add New Profile
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[
        { name: 'Cyberpunk 2077', developer: 'CD PROJEKT RED', image: 'https://picsum.photos/seed/cp2077/800/400', active: true },
        { name: 'Valorant', developer: 'Riot Games', image: 'https://picsum.photos/seed/valorant/800/400', active: false },
        { name: 'Elden Ring', developer: 'FromSoftware', image: 'https://picsum.photos/seed/elden/800/400', active: false },
        { name: 'Starfield', developer: 'Bethesda', image: 'https://picsum.photos/seed/starfield/800/400', active: false },
      ].map((game, i) => (
        <GlassCard key={i} className="overflow-hidden p-0 group">
          <div className="h-48 relative overflow-hidden">
            <img src={game.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
            {game.active && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded bg-acid text-charcoal text-[10px] font-bold uppercase tracking-widest shadow-neon">
                Active
              </div>
            )}
          </div>
          <div className="p-6 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-display font-bold tracking-wide">{game.name}</h3>
              <p className="text-xs text-white/40 uppercase tracking-widest font-medium">{game.developer}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-acid hover:border-acid/30 transition-all">
                <Settings size={16} />
              </button>
              <button className="px-4 py-2 rounded-lg bg-surface border border-border text-[10px] font-bold uppercase tracking-widest hover:border-acid/50 transition-colors">Assign Devices</button>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  </div>
);

const MacroView = () => (
  <div className="p-8 h-full flex flex-col gap-8">
    <div className="flex justify-between items-end shrink-0">
      <div>
        <h1 className="text-4xl font-display font-bold tracking-tight">MACRO EDITOR</h1>
        <p className="text-white/40 text-sm mt-1">Create complex automation sequences</p>
      </div>
      <div className="flex gap-4">
        <button className="px-6 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center gap-2">
          <Activity size={16} />
          Record
        </button>
        <button className="px-6 py-2 rounded-lg bg-acid text-charcoal font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2">
          <Plus size={16} />
          New Macro
        </button>
      </div>
    </div>

    <div className="flex-1 flex gap-6 overflow-hidden">
      <div className="w-72 flex flex-col gap-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search macros..." 
            className="w-full bg-surface border border-border rounded-lg px-10 py-3 text-xs font-medium outline-none focus:border-acid/50 transition-colors"
          />
          <Settings size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
          {['Fast Buy CS2', 'Burst Fire', 'Auto Loot', 'Emote Spam', 'Dodge Roll'].map((m, i) => (
            <div key={i} className={`p-4 rounded-lg border transition-all cursor-pointer ${i === 0 ? 'bg-acid/10 border-acid/30 text-acid' : 'bg-surface border-border text-white/40 hover:border-white/20'}`}>
              <div className="text-xs font-bold">{m}</div>
              <div className="text-[10px] uppercase tracking-widest mt-1 opacity-60">12 Actions â€¢ 450ms</div>
            </div>
          ))}
        </div>
      </div>

      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Timeline: Fast Buy CS2</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <Layers size={12} />
              Loop: Off
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <Zap size={12} />
              Delay: Recorded
            </div>
          </div>
        </div>
        <div className="flex-1 p-8 overflow-x-auto custom-scrollbar flex items-center gap-4 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(255,255,255,0.02)_40px,rgba(255,255,255,0.02)_41px)]">
          {[
            { key: 'B', type: 'Down', delay: '0ms' },
            { key: 'B', type: 'Up', delay: '12ms' },
            { key: 'Wait', type: 'Delay', delay: '50ms' },
            { key: '4', type: 'Down', delay: '62ms' },
            { key: '4', type: 'Up', delay: '74ms' },
            { key: 'Wait', type: 'Delay', delay: '50ms' },
            { key: '2', type: 'Down', delay: '124ms' },
            { key: '2', type: 'Up', delay: '136ms' },
          ].map((action, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className={`shrink-0 w-24 p-4 rounded-lg border flex flex-col items-center gap-2 ${action.type === 'Delay' ? 'bg-surface border-border border-dashed opacity-40' : 'bg-acid/5 border-acid/20'}`}
            >
              <div className={`text-lg font-display font-bold ${action.type === 'Delay' ? 'text-white/20' : 'text-acid'}`}>{action.key}</div>
              <div className="text-[8px] font-bold uppercase tracking-widest text-white/40">{action.type}</div>
              <div className="text-[10px] font-mono text-white/20">{action.delay}</div>
            </motion.div>
          ))}
          <button className="shrink-0 w-12 h-12 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-white/20 hover:text-acid hover:border-acid/30 transition-all">
            <Plus size={20} />
          </button>
        </div>
        <div className="p-6 border-t border-white/5 bg-white/2 flex justify-end gap-4">
          <button className="px-6 py-2 rounded-lg bg-surface border border-border text-xs font-bold uppercase tracking-widest hover:border-white/20 transition-colors">Cancel</button>
          <button className="px-8 py-2 rounded-lg bg-acid text-charcoal font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all">Save Macro</button>
        </div>
      </GlassCard>
    </div>
  </div>
);

// --- Studio Types & Data ---
type BlendMode = 'Normal' | 'Add' | 'Screen' | 'Multiply';
type Direction = 'Left' | 'Right' | 'Up' | 'Down' | 'Center';

type Layer = {
  id: string;
  name: string;
  effect: string;
  colorA: string;
  colorB: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blend: BlendMode;
  intensity: number;
  speed: number;
  direction: Direction;
};

type Preset = {
  id: string;
  name: string;
  subtitle: string;
  active?: boolean;
};

const initialLayers: Layer[] = [
  {
    id: 'layer-1',
    name: 'Wave Effect',
    effect: 'Wave',
    colorA: '#18ff6d',
    colorB: '#00d7ff',
    visible: true,
    locked: false,
    opacity: 100,
    blend: 'Add',
    intensity: 74,
    speed: 62,
    direction: 'Right',
  },
  {
    id: 'layer-2',
    name: 'Reactive Layer',
    effect: 'Reactive',
    colorA: '#18ff6d',
    colorB: '#7c3aed',
    visible: true,
    locked: false,
    opacity: 72,
    blend: 'Screen',
    intensity: 44,
    speed: 31,
    direction: 'Center',
  },
  {
    id: 'layer-3',
    name: 'Static Base',
    effect: 'Static',
    colorA: '#1f2937',
    colorB: '#111827',
    visible: true,
    locked: false,
    opacity: 100,
    blend: 'Normal',
    intensity: 20,
    speed: 0,
    direction: 'Center',
  },
  {
    id: 'layer-4',
    name: 'Starlight Accents',
    effect: 'Starlight',
    colorA: '#f59e0b',
    colorB: '#ec4899',
    visible: false,
    locked: false,
    opacity: 55,
    blend: 'Add',
    intensity: 66,
    speed: 18,
    direction: 'Up',
  },
];

const initialPresets: Preset[] = [
  { id: 'p1', name: 'Forest Pulse', subtitle: 'Wave + reactive stack', active: true },
  { id: 'p2', name: 'Night Raid', subtitle: 'Low glow tactical' },
  { id: 'p3', name: 'Spectrum Drift', subtitle: 'Rainbow movement' },
  { id: 'p4', name: 'Static Minimal', subtitle: 'No animation' },
];

const blendStyles: Record<BlendMode, string> = {
  Normal: 'bg-zinc-800/80 text-zinc-200 border-zinc-700',
  Add: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Screen: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  Multiply: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
};

const effectSwatches = [
  { name: 'Wave', icon: Waves },
  { name: 'Reactive', icon: Sparkles },
  { name: 'Static', icon: Palette },
  { name: 'Breathing', icon: Flame },
  { name: 'Ripple', icon: SplitSquareHorizontal },
  { name: 'Audio', icon: Bolt },
];

function SectionTitle({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400">{title}</h3>
      {right}
    </div>
  );
}

function StudioSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  suffix = '',
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span className="font-medium text-zinc-200">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full appearance-none rounded-full bg-zinc-800 accent-emerald-400"
      />
    </div>
  );
}

function PillButton({
  active,
  children,
  onClick,
  tone = 'neutral',
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  tone?: 'neutral' | 'green';
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
        active
          ? tone === 'green'
            ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300 shadow-[0_0_0_1px_rgba(52,211,153,0.12)]'
            : 'border-zinc-500 bg-zinc-800 text-white'
          : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
      }`}
    >
      {children}
    </button>
  );
}

function IconCircle({ icon: Icon, active = false }: { icon: React.ComponentType<{ className?: string }>; active?: boolean }) {
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
        active ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' : 'border-zinc-800 bg-zinc-900 text-zinc-400'
      }`}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}

const StudioView = () => {
  const [layers, setLayers] = useState<Layer[]>(initialLayers);
  const [selectedLayerId, setSelectedLayerId] = useState(initialLayers[0].id);
  const [presets, setPresets] = useState<Preset[]>(initialPresets);
  const [liveSync, setLiveSync] = useState(true);
  const [timeline, setTimeline] = useState(62);
  const [selectedZone, setSelectedZone] = useState<'Keyboard' | 'Mouse' | 'Headset'>('Keyboard');
  const [advancedMode, setAdvancedMode] = useState(false);

  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedLayerId) ?? layers[0],
    [layers, selectedLayerId]
  );

  const updateLayer = (id: string, patch: Partial<Layer>) => {
    setLayers((prev) => prev.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer)));
  };

  const moveLayer = (index: number, direction: -1 | 1) => {
    setLayers((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const duplicateLayer = (layer: Layer) => {
    const copy: Layer = { ...layer, id: `${layer.id}-copy-${Date.now()}`, name: `${layer.name} Copy` };
    setLayers((prev) => [copy, ...prev]);
    setSelectedLayerId(copy.id);
  };

  const deleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) {
      const fallback = layers.find((l) => l.id !== id)?.id;
      if (fallback) setSelectedLayerId(fallback);
    }
  };

  const addLayer = (effect: string) => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `New ${effect} Layer`,
      effect,
      colorA: '#18ff6d',
      colorB: '#00d7ff',
      visible: true,
      locked: false,
      opacity: 100,
      blend: 'Normal',
      intensity: 50,
      speed: 50,
      direction: 'Center',
    };
    setLayers((prev) => [newLayer, ...prev]);
    setSelectedLayerId(newLayer.id);
  };

  const loadPreset = (preset: Preset) => {
    // In a real app, this would fetch the layer stack for the preset
    // For now, we'll just simulate it by resetting to initial layers or a variation
    setLayers(initialLayers.map(l => ({ ...l, id: `${l.id}-${Date.now()}` })));
    setPresets(prev => prev.map(p => ({ ...p, active: p.id === preset.id })));
  };

  const savePreset = () => {
    const name = `Preset ${presets.length + 1}`;
    const newPreset = { id: `p${Date.now()}`, name, subtitle: `${layers.length} layer stack`, active: true };
    setPresets((prev) => [newPreset, ...prev.map(p => ({ ...p, active: false }))]);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="h-16 border-b border-white/5 bg-[#111215]/90 px-8 py-4 backdrop-blur flex items-center justify-between shrink-0">
        <div className="flex items-center gap-8">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">Chroma Studio</div>
            <h1 className="mt-1 text-xl font-semibold tracking-tight">Lighting Editor</h1>
          </div>
          <div className="flex gap-2">
            <PillButton active={liveSync} onClick={() => setLiveSync((v) => !v)} tone="green">
              {liveSync ? 'Live Sync On' : 'Live Sync Off'}
            </PillButton>
            <PillButton active={advancedMode} onClick={() => setAdvancedMode((v) => !v)}>
              Advanced Mode
            </PillButton>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10 transition-colors">
            <Save className="h-4 w-4" /> Save
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[300px_minmax(0,1fr)_340px] overflow-hidden">
        {/* Left Panel: Presets & Timeline */}
        <div className="border-r border-white/5 bg-[#0e0f12] p-5 overflow-y-auto custom-scrollbar space-y-6">
          <SectionTitle
            title="Presets"
            right={
              <button onClick={savePreset} className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                <Plus className="h-3.5 w-3.5" /> New
              </button>
            }
          />

          <div className="space-y-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  preset.active ? 'border-emerald-400/30 bg-emerald-400/10 shadow-[0_0_0_1px_rgba(16,185,129,0.08)]' : 'border-white/6 bg-white/[0.03] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-zinc-100">{preset.name}</div>
                  {preset.active && <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-bold tracking-wide text-black">ACTIVE</span>}
                </div>
                <div className="mt-1 text-xs text-zinc-500">{preset.subtitle}</div>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
            <SectionTitle title="Timeline" />
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Loop</span>
                <span>{advancedMode ? 'Ping-pong' : 'Repeat'}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={timeline}
                onChange={(e) => setTimeline(Number(e.target.value))}
                className="h-2 w-full appearance-none rounded-full bg-zinc-800 accent-emerald-400"
              />
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>0ms</span>
                <span>{timeline}ms</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
            <SectionTitle title="Output Zone" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(['Keyboard', 'Mouse', 'Headset'] as const).map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    selectedZone === zone
                      ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                      : 'border-white/6 bg-white/[0.03] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Panel: Layers & Canvas */}
        <div className="overflow-y-auto bg-[#0c0d10] p-5 custom-scrollbar">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/6 bg-white/[0.03] p-4">
                <SectionTitle
                  title="Layers"
                  right={<span className="text-xs text-zinc-500">Drag, hide, lock</span>}
                />
                <div className="mt-4 space-y-2">
                  {layers.map((layer, index) => {
                    const active = layer.id === selectedLayerId;
                    return (
                      <motion.div
                        key={layer.id}
                        layout
                        className={`rounded-2xl border p-3 transition ${
                          active ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-white/6 bg-[#111216] hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <button className="mt-1 cursor-grab text-zinc-600 hover:text-zinc-300">
                            <GripVertical className="h-4 w-4" />
                          </button>
                          <button onClick={() => setSelectedLayerId(layer.id)} className="min-w-0 flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: layer.colorA }} />
                              <div className="truncate text-sm font-semibold text-zinc-100">{layer.name}</div>
                            </div>
                            <div className="mt-1 text-[10px] text-zinc-500 uppercase tracking-wider">{layer.effect} · {layer.blend}</div>
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateLayer(layer.id, { visible: !layer.visible })}
                              className="rounded-lg border border-white/6 bg-white/[0.03] p-2 text-zinc-400 hover:text-zinc-100"
                            >
                              {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => updateLayer(layer.id, { locked: !layer.locked })}
                              className={`rounded-lg border p-2 ${
                                layer.locked ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300' : 'border-white/6 bg-white/[0.03] text-zinc-400 hover:text-zinc-100'
                              }`}
                            >
                              <Lock className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.2em] ${blendStyles[layer.blend]}`}>
                            {layer.blend}
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => moveLayer(index, -1)} className="rounded-md border border-white/6 bg-white/[0.03] p-1.5 text-zinc-500 hover:text-zinc-100"><ChevronLeft className="h-3.5 w-3.5" /></button>
                            <button onClick={() => moveLayer(index, 1)} className="rounded-md border border-white/6 bg-white/[0.03] p-1.5 text-zinc-500 hover:text-zinc-100"><ChevronRight className="h-3.5 w-3.5" /></button>
                            <button onClick={() => duplicateLayer(layer)} className="rounded-md border border-white/6 bg-white/[0.03] p-1.5 text-zinc-500 hover:text-zinc-100"><Copy className="h-3.5 w-3.5" /></button>
                            <button onClick={() => deleteLayer(layer.id)} className="rounded-md border border-white/6 bg-white/[0.03] p-1.5 text-zinc-500 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/6 bg-white/[0.03] p-4">
                <SectionTitle title="Add Effect" />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {effectSwatches.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      onClick={() => addLayer(name)}
                      className="flex items-center gap-2 rounded-2xl border border-white/6 bg-[#111216] p-3 text-left transition hover:border-emerald-400/30 hover:bg-emerald-400/10"
                    >
                      <IconCircle icon={Icon} active={name === selectedLayer.effect} />
                      <div className="text-xs font-semibold text-zinc-100">{name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-white/6 bg-[#111216] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">Selected layer</div>
                    <h3 className="mt-1 text-xl font-semibold">{selectedLayer.name}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/6 bg-white/[0.03] px-3 py-1.5"><Link2 className="h-3.5 w-3.5" /> Target: {selectedZone}</span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
                  <div className="rounded-3xl border border-white/6 bg-black/20 p-4 space-y-5">
                    <SectionTitle title="Effect controls" />
                    <StudioSlider label="Opacity" value={selectedLayer.opacity} onChange={(v) => updateLayer(selectedLayer.id, { opacity: v })} />
                    <StudioSlider label="Intensity" value={selectedLayer.intensity} onChange={(v) => updateLayer(selectedLayer.id, { intensity: v })} />
                    <StudioSlider label="Speed" value={selectedLayer.speed} onChange={(v) => updateLayer(selectedLayer.id, { speed: v })} />

                    <div className="space-y-2">
                      <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Blend mode</div>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Normal', 'Add', 'Screen', 'Multiply'] as BlendMode[]).map((blend) => (
                          <button
                            key={blend}
                            onClick={() => updateLayer(selectedLayer.id, { blend })}
                            className={`rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
                              selectedLayer.blend === blend
                                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                                : 'border-white/6 bg-white/[0.03] text-zinc-400 hover:text-zinc-100'
                            }`}
                          >
                            {blend}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Direction</div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['Left', 'Center', 'Right', 'Up', 'Down'] as Direction[]).map((dir) => (
                          <button
                            key={dir}
                            onClick={() => updateLayer(selectedLayer.id, { direction: dir })}
                            className={`rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
                              selectedLayer.direction === dir
                                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                                : 'border-white/6 bg-white/[0.03] text-zinc-400 hover:text-zinc-100'
                            }`}
                          >
                            {dir}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/6 bg-black/20 p-4">
                    <SectionTitle title="Device canvas" />
                    <div className="mt-4 flex min-h-[380px] items-center justify-center rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.05),_transparent_70%)] p-6">
                      <div className="relative w-full max-w-[600px] rounded-[28px] border border-white/6 bg-[#0f1014] p-5 shadow-2xl">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-9 rounded-[24px] border border-white/5 bg-[#121319] p-4">
                            <div className="grid grid-cols-10 gap-1.5 relative overflow-hidden rounded-md">
                              {/* Simulated Lighting Preview */}
                              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                                {layers.filter(l => l.visible).map((layer, i) => (
                                  <motion.div
                                    key={layer.id}
                                    initial={false}
                                    animate={{ 
                                      opacity: layer.opacity / 100,
                                      x: layer.direction === 'Left' ? -20 : layer.direction === 'Right' ? 20 : 0,
                                      y: layer.direction === 'Up' ? -20 : layer.direction === 'Down' ? 20 : 0,
                                      scale: 1 + (layer.intensity / 200)
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                    className="absolute inset-0"
                                    style={{ 
                                      background: `radial-gradient(circle at center, ${layer.colorA}, transparent)`,
                                      mixBlendMode: layer.blend === 'Add' ? 'screen' : layer.blend === 'Screen' ? 'lighten' : layer.blend === 'Multiply' ? 'multiply' : 'normal'
                                    }}
                                  />
                                ))}
                              </div>

                              {Array.from({ length: 40 }).map((_, i) => {
                                const highlighted = [2, 5, 14, 15, 16, 20, 23, 27, 34, 35].includes(i);
                                return (
                                  <div
                                    key={i}
                                    className={`aspect-square rounded-md border transition relative z-10 ${
                                      highlighted
                                        ? 'border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                                        : 'border-white/5 bg-black/20'
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                          <div className="col-span-3 flex flex-col gap-3">
                            <div className="flex-1 rounded-[24px] border border-white/5 bg-[#121319] p-4 flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 z-0 pointer-events-none">
                                {layers.filter(l => l.visible).map((layer) => (
                                  <div 
                                    key={layer.id}
                                    className="absolute inset-0"
                                    style={{ 
                                      background: `radial-gradient(circle at center, ${layer.colorA}22, transparent)`,
                                      opacity: layer.opacity / 100
                                    }}
                                  />
                                ))}
                              </div>
                              <div className="h-24 w-12 rounded-[18px] border border-white/6 bg-gradient-to-b from-zinc-800 to-zinc-950 relative z-10" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Inspector */}
        <aside className="border-l border-white/5 bg-[#0e0f12] p-5 overflow-y-auto custom-scrollbar space-y-4">
          <SectionTitle title="Inspector" />
          <div className="rounded-3xl border border-white/6 bg-[#111216] p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl border border-white/6 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.35),rgba(255,255,255,0.03))]" />
              <div>
                <div className="text-sm font-semibold uppercase tracking-wide">Keyboard</div>
                <div className="text-xs text-zinc-500">FW v1.04.22</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                <span>Battery</span>
                <span className="text-emerald-300">77%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800">
                <div className="h-full rounded-full bg-emerald-400 w-[77%]" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/6 bg-[#111216] p-4">
            <SectionTitle title="Quick Fixes" />
            <ul className="mt-3 space-y-3 text-[11px] text-zinc-400">
              <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />Layer reorder & visibility</li>
              <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />Blend modes & opacity</li>
              <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />Timeline scrubber</li>
              <li className="flex gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />Live sync targeting</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

const DeviceView = ({ type }: { type: string }) => {
  const [activeSubTab, setActiveSubTab] = useState('Performance');
  const [dpi, setDpi] = useState(1800);
  const [brightness, setBrightness] = useState(50);
  const [pollingRate, setPollingRate] = useState('1000 Hz');

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sub Tabs */}
      <div className="h-14 border-b border-border bg-surface/50 backdrop-blur-md flex items-center justify-center gap-12 px-8 shrink-0">
        {['Performance', 'Lighting', 'Calibration', 'Customize'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`relative h-full flex items-center px-4 font-display font-bold text-xs uppercase tracking-[0.2em] transition-colors ${activeSubTab === tab ? 'text-acid' : 'text-white/40 hover:text-white/80'}`}
          >
            {tab}
            {activeSubTab === tab && (
              <motion.div 
                layoutId="subtab-active" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-acid shadow-neon" 
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Settings Panel */}
        <div className="w-80 border-r border-border p-8 overflow-y-auto custom-scrollbar space-y-8 bg-charcoal/30">
          <AnimatePresence mode="wait">
            {activeSubTab === 'Performance' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Sensitivity</h3>
                    <NeonToggle active={true} onClick={() => {}} />
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map(stage => (
                      <button 
                        key={stage}
                        className={`aspect-square rounded border flex flex-col items-center justify-center gap-1 transition-all ${stage === 2 ? 'bg-acid/10 border-acid text-acid' : 'bg-surface border-border text-white/20 hover:border-white/20'}`}
                      >
                        <span className="text-[8px] font-bold">S{stage}</span>
                        <span className="text-[10px] font-mono">{stage === 2 ? dpi : 800 * stage}</span>
                      </button>
                    ))}
                  </div>
                  <AcidSlider label="Dots Per Inch (DPI)" value={(dpi / 20000) * 100} onChange={(v: number) => setDpi(Math.round((v / 100) * 20000))} />
                </div>

                <div className="space-y-6 pt-8 border-t border-border">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Power Management</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Polling Rate</label>
                      <select 
                        value={pollingRate}
                        onChange={(e) => setPollingRate(e.target.value)}
                        className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-xs font-bold outline-none focus:border-acid/50 transition-colors"
                      >
                        <option>125 Hz</option>
                        <option>500 Hz</option>
                        <option>1000 Hz</option>
                        <option>4000 Hz</option>
                        <option>8000 Hz</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-surface border border-border">
                      <div className="flex items-center gap-3">
                        <Battery size={16} className="text-acid" />
                        <span className="text-xs font-bold">Low Power Mode</span>
                      </div>
                      <NeonToggle active={false} onClick={() => {}} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'Lighting' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Brightness</h3>
                    <Volume2 size={14} className="text-white/20" />
                  </div>
                  <AcidSlider label="Intensity" value={brightness} onChange={setBrightness} />
                </div>

                <div className="space-y-6 pt-8 border-t border-border">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Quick Effects</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Static', 'Breathing', 'Spectrum', 'Wave', 'Reactive', 'Starlight'].map((effect, i) => (
                      <button 
                        key={i}
                        className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${i === 3 ? 'bg-acid/10 border-acid text-acid' : 'bg-surface border-border text-white/40 hover:border-white/20'}`}
                      >
                        <Palette size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{effect}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-border">
                  <button className="w-full py-4 rounded-lg bg-acid/10 border border-acid/30 text-acid text-[10px] font-bold uppercase tracking-widest hover:bg-acid/20 transition-all flex items-center justify-center gap-2">
                    <Maximize2 size={14} />
                    Open Chroma Studio
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center Hero Panel */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-12 bg-[radial-gradient(circle_at_center,_rgba(0,255,65,0.03)_0%,_transparent_70%)]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-2xl aspect-video"
          >
            <img 
              src={`https://picsum.photos/seed/${type.toLowerCase()}/800/600`} 
              alt={type} 
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              referrerPolicy="no-referrer"
            />
            {/* Interactive Hotspots */}
            <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-acid shadow-neon cursor-pointer hover:scale-150 transition-transform" />
            <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-acid shadow-neon cursor-pointer hover:scale-150 transition-transform" />
          </motion.div>
          
          <div className="absolute bottom-12 flex gap-4">
            <button className="px-6 py-2 rounded-full bg-acid/10 border border-acid/30 text-acid text-[10px] font-bold uppercase tracking-widest">Standard</button>
            <button className="px-6 py-2 rounded-full bg-surface border border-border text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">Hypershift</button>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="w-80 border-l border-border p-8 overflow-y-auto custom-scrollbar space-y-8 bg-charcoal/30">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-surface border border-border flex items-center justify-center">
                <img src={`https://picsum.photos/seed/${type.toLowerCase()}/48/48`} className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider">{type}</div>
                <div className="text-[10px] text-white/40 font-mono">FW: v1.04.22</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span>Battery</span>
                <span className="text-acid">77%</span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-acid w-[77%]" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Active Profile</h3>
            <div className="p-4 rounded-lg bg-surface border border-border flex items-center justify-between group cursor-pointer hover:border-acid/30 transition-colors">
              <span className="text-xs font-bold">Default</span>
              <Settings size={14} className="text-white/20 group-hover:text-acid transition-colors" />
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-acid/5 border border-acid/20 text-acid">
              <Zap size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Firmware Update Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main App ---

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('Dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-charcoal overflow-hidden select-none">
      {/* Window Controls (Mock) */}
      <div className="h-8 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-acid/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-acid" />
          </div>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">NeonSuite Control v4.2</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white/20 hover:text-white transition-colors"><Bell size={14} /></button>
          <button className="text-white/20 hover:text-white transition-colors"><Settings size={14} /></button>
          <div className="w-px h-3 bg-border" />
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-white/5 border border-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/5 border border-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/5 border border-white/10" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <motion.aside 
          animate={{ width: isSidebarCollapsed ? 80 : 260 }}
          className="bg-surface border-r border-border flex flex-col shrink-0 z-20"
        >
          <div className="p-6 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-acid font-display font-black text-xl tracking-tighter italic"
              >
                NEON<span className="text-white">SUITE</span>
              </motion.div>
            )}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeView === 'Dashboard'} onClick={() => setActiveView('Dashboard')} />
            <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Hardware</div>
            <SidebarItem icon={MousePointer2} label="Mouse" active={activeView === 'Mouse'} onClick={() => setActiveView('Mouse')} />
            <SidebarItem icon={Keyboard} label="Keyboard" active={activeView === 'Keyboard'} onClick={() => setActiveView('Keyboard')} />
            <SidebarItem icon={Headphones} label="Audio" active={activeView === 'Audio'} onClick={() => setActiveView('Audio')} />
            <SidebarItem icon={Monitor} label="System" active={activeView === 'System'} onClick={() => setActiveView('System')} />
            
            <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Software</div>
            <SidebarItem icon={Layers} label="Profiles" active={activeView === 'Profiles'} onClick={() => setActiveView('Profiles')} />
            <SidebarItem icon={Palette} label="Studio" active={activeView === 'Studio'} onClick={() => setActiveView('Studio')} />
            <SidebarItem icon={Cpu} label="Macros" active={activeView === 'Macro'} onClick={() => setActiveView('Macro')} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-acid/20 flex items-center justify-center text-acid shrink-0">
                <User size={20} />
              </div>
              {!isSidebarCollapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
                  <div className="text-xs font-bold truncate">DEVIN MARCONI</div>
                  <div className="text-[10px] text-white/40 truncate">Pro Elite Member</div>
                </motion.div>
              )}
              {!isSidebarCollapsed && <Power size={14} className="ml-auto text-white/20 hover:text-red-500 cursor-pointer transition-colors" />}
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Top Bar */}
          <div className="h-16 border-b border-border bg-surface/30 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-4">
              <div className="text-xs font-bold uppercase tracking-widest text-white/40">{activeView}</div>
              <div className="w-px h-4 bg-border" />
              <div className="text-sm font-display font-bold tracking-wide">
                {activeView === 'Dashboard' ? 'Overview' : 'Viper Ultimate Wireless'}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <Wifi size={12} className="text-acid" />
                2.4 GHz
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                <Battery size={12} className="text-acid" />
                77%
              </div>
              <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full"
              >
                {activeView === 'Dashboard' ? (
                  <DashboardView onDeviceClick={(type) => setActiveView(type)} />
                ) : activeView === 'Profiles' ? (
                  <ProfilesView />
                ) : activeView === 'Studio' ? (
                  <StudioView />
                ) : activeView === 'Macro' ? (
                  <MacroView />
                ) : activeView === 'Audio' ? (
                  <AudioView />
                ) : activeView === 'System' ? (
                  <SystemView />
                ) : (
                  <DeviceView type={activeView} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
