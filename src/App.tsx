/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Github, 
  Download, 
  CheckCircle2, 
  MousePointer2, 
  Keyboard, 
  Headphones, 
  Settings, 
  Sun, 
  Moon, 
  Zap, 
  Battery, 
  BatteryCharging,
  Sliders,
  Palette,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SUPPORTED_DEVICES } from './data/supported_devices';

// --- Types ---
interface Device {
  name: string;
  serial: string;
  device_type: string;
  battery_level?: number | null;
  is_charging: boolean;
  pid: string;
}

// --- Mock Data (for preview) ---
const MOCK_DEVICES: Device[] = [
  { name: "Razer Basilisk V3", serial: "BSLK-001", device_type: "mouse", battery_level: 85, is_charging: false, pid: "1532:0099" },
  { name: "Razer BlackWidow V4", serial: "BW-002", device_type: "keyboard", battery_level: null, is_charging: false, pid: "1532:0287" },
  { name: "Razer BlackShark V2 Pro", serial: "BS-003", device_type: "headset", battery_level: 42, is_charging: true, pid: "1532:0527" },
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(MOCK_DEVICES[0]);
  const [accentColor, setAccentColor] = useState("#44d62c");
  const [brightness, setBrightness] = useState(100);
  const [pollRate, setPollRate] = useState("1000Hz");
  const [isTauri, setIsTauri] = useState(false);
  const [activeTab, setActiveTab] = useState<'lighting' | 'performance' | 'compatibility'>('lighting');
  const [searchQuery, setSearchQuery] = useState("");
  const [dpiStages, setDpiStages] = useState([
    { stage: 1, value: 400, active: true },
    { stage: 2, value: 800, active: true },
    { stage: 3, value: 1600, active: true },
    { stage: 4, value: 3200, active: true },
    { stage: 5, value: 6400, active: true },
  ]);
  const [activeDpiStage, setActiveDpiStage] = useState(3);

  // Check if running in Tauri
  useEffect(() => {
    // @ts-ignore
    if (window.__TAURI__) {
      setIsTauri(true);
    }
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const getDeviceIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('mousemat')) return <Palette className="w-4 h-4" />;
    if (t.includes('mouse')) return <MousePointer2 className="w-4 h-4" />;
    if (t.includes('keyboard')) return <Keyboard className="w-4 h-4" />;
    if (t.includes('headset')) return <Headphones className="w-4 h-4" />;
    if (t.includes('misc')) return <Settings className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0d1117] text-[#c9d1d9]' : 'bg-[#f6f8fa] text-[#24292f]'} font-sans selection:bg-[#44d62c] selection:text-black`}>
      {/* Header */}
      <header className={`border-b ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} px-6 py-4 flex items-center justify-between sticky top-0 z-20`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#44d62c] rounded-lg flex items-center justify-center shadow-lg shadow-[#44d62c]/20">
            <ShieldCheck className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>RazerCtrl</h1>
            <p className="text-[10px] text-[#44d62c] font-black uppercase tracking-[0.2em]">Unbreakable Edition</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-md transition-colors ${isDark ? 'hover:bg-[#30363d] text-[#8b949e]' : 'hover:bg-[#f3f4f6] text-[#57606a]'}`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className={`h-6 w-[1px] ${isDark ? 'bg-[#30363d]' : 'bg-[#d0d7de]'}`} />
          <button className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-[#238636] hover:bg-[#2ea043]' : 'bg-[#1f883d] hover:bg-[#1a7f37]'} text-white rounded-md transition-all text-sm font-semibold shadow-sm`}>
            <Download className="w-4 h-4" />
            Install
          </button>
        </div>
      </header>

      <div className="flex max-w-[1400px] mx-auto min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className={`w-72 border-r ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'} p-4 hidden md:block`}>
          <div className="mb-6">
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 px-2 ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Connected Devices</h3>
            <div className="space-y-1">
              {MOCK_DEVICES.map((device) => (
                <button
                  key={device.serial}
                  onClick={() => setSelectedDevice(device)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                    selectedDevice?.serial === device.serial 
                      ? `bg-[#44d62c]/10 text-[#44d62c] border border-[#44d62c]/20` 
                      : `hover:bg-[#44d62c]/5 ${isDark ? 'text-[#8b949e] hover:text-[#c9d1d9]' : 'text-[#57606a] hover:text-[#24292f]'}`
                  }`}
                >
                  <div className={`p-2 rounded-lg ${selectedDevice?.serial === device.serial ? 'bg-black/10' : 'bg-[#161b22]'}`}>
                    {getDeviceIcon(device.device_type)}
                  </div>
                  <div className="flex flex-col items-start min-w-0">
                    <span className="truncate font-bold">{device.name}</span>
                    <span className="text-[10px] font-mono opacity-60">{device.pid}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t border-[#30363d]">
             <div className="px-2 py-3 bg-[#44d62c]/5 rounded-lg border border-[#44d62c]/10">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#44d62c] mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#44d62c] animate-pulse" />
                  RUST CORE ACTIVE
                </div>
                <p className="text-[10px] text-[#8b949e]">Memory-safe hardware interface initialized via zbus.</p>
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 p-1 bg-[#161b22] rounded-xl border border-[#30363d] w-fit">
            {(['lighting', 'performance', 'compatibility'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab 
                    ? 'bg-[#44d62c] text-black shadow-lg shadow-[#44d62c]/20' 
                    : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'compatibility' ? (
              <motion.div
                key="compatibility"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-extrabold tracking-tight text-white">Device Compatibility</h2>
                  <div className="relative">
                    <Sliders className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b949e]" />
                    <input
                      type="text"
                      placeholder="Search devices..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-[#161b22] border border-[#30363d] rounded-xl text-sm text-white focus:outline-none focus:border-[#44d62c] w-64"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {SUPPORTED_DEVICES.filter(d => 
                    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    d.id.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((device) => (
                    <div key={device.id} className="p-4 rounded-xl border border-[#30363d] bg-[#161b22] hover:border-[#44d62c] transition-colors group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-[#44d62c]/10 rounded-lg text-[#44d62c]">
                            {getDeviceIcon(device.category)}
                          </div>
                          <span className="text-[10px] font-bold text-[#44d62c] uppercase tracking-widest">{device.category}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#8b949e]">{device.id}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#44d62c] transition-colors">{device.name}</h4>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : selectedDevice ? (
              <motion.div
                key={selectedDevice.serial}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Device Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                      {selectedDevice.name}
                    </h2>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-[#8b949e] font-mono uppercase">Serial: {selectedDevice.serial}</p>
                      <span className="text-[#30363d]">|</span>
                      <p className="text-sm text-[#8b949e] font-mono uppercase">PID: {selectedDevice.pid}</p>
                    </div>
                  </div>
                  
                  {selectedDevice.battery_level != null && (
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'}`}>
                      {selectedDevice.is_charging ? <BatteryCharging className="w-4 h-4 text-[#44d62c]" /> : <Battery className="w-4 h-4 text-[#8b949e]" />}
                      <span className="text-sm font-bold">{selectedDevice.battery_level}%</span>
                    </div>
                  )}
                </div>

                {/* Control Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {activeTab === 'lighting' ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-2xl border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[#44d62c]/10 rounded-lg">
                          <Palette className="w-5 h-5 text-[#44d62c]" />
                        </div>
                        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>Lighting Effects</h3>
                      </div>
                      
                      <div className="space-y-8">
                        <div>
                          <label className="text-xs font-bold text-[#8b949e] uppercase mb-4 block">Static Color</label>
                          <div className="flex flex-wrap gap-4">
                            {['#44d62c', '#ff0000', '#0000ff', '#ffffff', '#ff00ff', '#ffff00', '#00ffff', '#ffa500'].map((color) => (
                              <button
                                key={color}
                                onClick={() => setAccentColor(color)}
                                className={`w-12 h-12 rounded-xl border-2 transition-all hover:scale-110 ${accentColor === color ? 'border-white scale-110 shadow-lg shadow-white/10' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                style={{ backgroundColor: color }}
                              />
                            ))}
                            <button className={`w-12 h-12 rounded-xl border-2 border-dashed ${isDark ? 'border-[#30363d] hover:border-[#8b949e]' : 'border-[#d0d7de] hover:border-[#57606a]'} flex items-center justify-center text-[#8b949e]`}>
                              +
                            </button>
                          </div>
                        </div>

                        <div className="max-w-md">
                          <div className="flex justify-between mb-3">
                            <label className="text-xs font-bold text-[#8b949e] uppercase">Brightness</label>
                            <span className="text-xs font-mono font-bold text-[#44d62c]">{brightness}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={brightness}
                            onChange={(e) => setBrightness(parseInt(e.target.value))}
                            className="w-full h-2 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-[#44d62c]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                      {/* DPI Stages */}
                      <div className={`p-6 rounded-2xl border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#44d62c]/10 rounded-lg">
                              <Activity className="w-5 h-5 text-[#44d62c]" />
                            </div>
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>DPI Stages</h3>
                          </div>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-[10px] font-bold text-[#8b949e] uppercase cursor-pointer">
                              <input type="checkbox" defaultChecked className="accent-[#44d62c] w-3 h-3" /> Enable stages
                            </label>
                            <label className="flex items-center gap-2 text-[10px] font-bold text-[#8b949e] uppercase cursor-pointer">
                              <input type="checkbox" defaultChecked className="accent-[#44d62c] w-3 h-3" /> Lock X/Y
                            </label>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {dpiStages.map((stage) => (
                            <div key={stage.stage} className="flex items-center gap-6">
                              <button 
                                onClick={() => setActiveDpiStage(stage.stage)}
                                className={`w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center border-2 transition-all ${
                                  activeDpiStage === stage.stage 
                                    ? 'bg-[#44d62c] text-black border-[#44d62c] shadow-lg shadow-[#44d62c]/20' 
                                    : 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]'
                                }`}
                              >
                                {stage.stage}
                              </button>
                              <div className="flex-1">
                                <input 
                                  type="range" 
                                  min="100" 
                                  max="20000" 
                                  step="50"
                                  value={stage.value}
                                  onChange={(e) => {
                                    const newStages = [...dpiStages];
                                    newStages[stage.stage - 1].value = parseInt(e.target.value);
                                    setDpiStages(newStages);
                                  }}
                                  className="w-full h-1.5 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-[#44d62c]"
                                />
                              </div>
                              <div className="w-20 text-right">
                                <span className={`text-sm font-mono font-bold ${activeDpiStage === stage.stage ? 'text-[#44d62c]' : 'text-[#8b949e]'}`}>
                                  {stage.value}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Polling Rate & Info */}
                      <div className="space-y-6">
                        <div className={`p-6 rounded-2xl border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                          <label className="text-xs font-bold text-[#8b949e] uppercase mb-6 block">Polling Rate</label>
                          <div className="grid grid-cols-2 gap-3">
                            {['125Hz', '500Hz', '1000Hz', '8000Hz'].map((rate) => (
                              <button
                                key={rate}
                                onClick={() => setPollRate(rate)}
                                className={`px-4 py-4 rounded-xl text-sm font-bold transition-all border-2 ${
                                  pollRate === rate 
                                    ? 'bg-[#44d62c] text-black border-[#44d62c] shadow-lg shadow-[#44d62c]/20' 
                                    : `${isDark ? 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#57606a] hover:border-[#57606a]'}`
                                }`}
                              >
                                {rate}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'} flex items-start gap-4`}>
                          <div className="p-2 bg-[#44d62c]/10 rounded-lg">
                            <Zap className="w-5 h-5 text-[#44d62c]" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase mb-1">Low Latency Mode</h4>
                            <p className="text-[11px] leading-relaxed text-[#8b949e]">
                              High polling rates increase CPU usage but provide the smoothest cursor movement and lowest input lag. Recommended for high-refresh rate monitors.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer Info */}
                <div className="mt-12 pt-8 border-t border-[#30363d] flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                      <div className="w-2 h-2 rounded-full bg-[#44d62c]" />
                      DAEMON: CONNECTED
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                      <div className="w-2 h-2 rounded-full bg-[#44d62c]" />
                      DRIVER: v3.12.0
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${isDark ? 'bg-[#21262d] hover:bg-[#30363d] text-white' : 'bg-[#f3f4f6] hover:bg-[#ebecf0] text-[#24292f]'}`}>
                      Reset to Default
                    </button>
                    <button className="px-8 py-2.5 bg-[#44d62c] hover:bg-[#38b324] text-black rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#44d62c]/20">
                      Save Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-[#44d62c]/10 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-[#44d62c]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Device Selected</h2>
                <p className="text-[#8b949e] max-w-sm">Select a device from the sidebar to begin configuring your unbreakable battlestation.</p>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
