import React, { useState } from 'react';
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
  Plus
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

const StudioView = () => (
  <div className="h-full flex flex-col overflow-hidden">
    <div className="h-16 border-b border-border bg-surface/50 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-display font-bold tracking-tight">CHROMA STUDIO</h1>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-acid/10 text-acid border border-acid/20"><Maximize2 size={16} /></button>
          <button className="p-2 rounded-lg bg-white/5 text-white/40 border border-white/5"><Layers size={16} /></button>
        </div>
      </div>
      <div className="flex gap-4">
        <button className="px-4 py-2 rounded-lg bg-surface border border-border text-[10px] font-bold uppercase tracking-widest hover:border-acid/50 transition-colors">Import</button>
        <button className="px-4 py-2 rounded-lg bg-surface border border-border text-[10px] font-bold uppercase tracking-widest hover:border-acid/50 transition-colors">Export</button>
        <button className="px-6 py-2 rounded-lg bg-acid text-charcoal font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all">Save</button>
      </div>
    </div>

    <div className="flex-1 flex overflow-hidden">
      {/* Layers Panel */}
      <div className="w-64 border-r border-border p-6 flex flex-col gap-6 bg-charcoal/30">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Layers</h3>
          <Plus size={14} className="text-white/40 cursor-pointer hover:text-acid" />
        </div>
        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {[
            { name: 'Wave Effect', type: 'Wave', active: true },
            { name: 'Reactive Layer', type: 'Reactive', active: true },
            { name: 'Static Base', type: 'Static', active: true },
            { name: 'Starlight Accents', type: 'Starlight', active: false },
          ].map((layer, i) => (
            <div key={i} className={`p-3 rounded-lg border flex items-center gap-3 group cursor-pointer transition-all ${layer.active ? 'bg-white/5 border-white/10' : 'opacity-40 grayscale'}`}>
              <div className={`w-2 h-2 rounded-full ${layer.active ? 'bg-acid shadow-neon' : 'bg-white/20'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold truncate">{layer.name}</div>
                <div className="text-[9px] text-white/40 uppercase tracking-widest">{layer.type}</div>
              </div>
              <Settings size={12} className="text-white/0 group-hover:text-white/40 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_rgba(0,255,65,0.02)_0%,_transparent_70%)] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-4xl aspect-video glass-card border-white/5 bg-charcoal/50 flex items-center justify-center overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #00FF41 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            
            <div className="relative z-10 flex gap-12 items-center">
              <div className="w-96 aspect-video rounded-xl bg-surface border border-white/10 flex items-center justify-center group cursor-move">
                <Keyboard size={64} className="text-white/10 group-hover:text-acid/20 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-br from-acid/10 via-purple-500/10 to-blue-500/10 animate-pulse" />
              </div>
              <div className="w-32 aspect-[2/3] rounded-xl bg-surface border border-white/10 flex items-center justify-center group cursor-move">
                <MousePointer2 size={32} className="text-white/10 group-hover:text-acid/20 transition-colors" />
                <div className="absolute inset-0 bg-gradient-to-tr from-acid/10 via-orange-500/10 to-red-500/10 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Canvas Controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-surface/80 backdrop-blur-md border border-white/10 shadow-2xl">
          {[Maximize2, Layers, Palette, Zap, Activity].map((Icon, i) => (
            <button key={i} className="p-3 rounded-full hover:bg-acid/10 hover:text-acid text-white/40 transition-all">
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 border-l border-border p-8 overflow-y-auto custom-scrollbar space-y-8 bg-charcoal/30">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Effect Properties</h3>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Color Pattern</label>
            <div className="h-8 w-full rounded-lg bg-gradient-to-r from-red-500 via-acid to-blue-500 border border-white/10 shadow-inner" />
          </div>
          
          <AcidSlider label="Speed" value={65} onChange={() => {}} />
          <AcidSlider label="Width" value={40} onChange={() => {}} />
          
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Direction</label>
            <div className="grid grid-cols-4 gap-2">
              {[ChevronLeft, ChevronRight, ChevronLeft, ChevronRight].map((Icon, i) => (
                <button key={i} className={`p-3 rounded-lg border flex items-center justify-center transition-all ${i === 1 ? 'bg-acid/10 border-acid text-acid' : 'bg-surface border-border text-white/20 hover:border-white/20'}`}>
                  <Icon size={16} className={i === 2 ? 'rotate-90' : i === 3 ? '-rotate-90' : ''} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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
