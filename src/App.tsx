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
  ShieldCheck,
  Search,
  RefreshCw,
  Cpu,
  Clock,
  Wifi,
  Plus,
  Trash2,
  Command,
  Type,
  MousePointer,
  Share
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { invoke } from '@tauri-apps/api/core';
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

interface DeviceConfig {
  accentColor: string;
  brightness: number;
  pollRate: string;
  dpiStages: { stage: number; value: number; active: boolean }[];
  activeDpiStage: number;
}

// --- Mock Data (for preview) ---
const MOCK_DEVICES: Device[] = [
  { name: "Razer Basilisk V3", serial: "BSLK-001", device_type: "mouse", battery_level: 85, is_charging: false, pid: "1532:0099" },
  { name: "Razer BlackWidow V4", serial: "BW-002", device_type: "keyboard", battery_level: null, is_charging: false, pid: "1532:0287" },
  { name: "Razer BlackShark V2 Pro", serial: "BS-003", device_type: "headset", battery_level: 42, is_charging: true, pid: "1532:0527" },
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(MOCK_DEVICES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [daemonStatus, setDaemonStatus] = useState<'connected' | 'error' | 'scanning'>('connected');
  const [lastScanned, setLastScanned] = useState<Date>(new Date());
  
  // Per-device configurations
  const [deviceConfigs, setDeviceConfigs] = useState<Record<string, DeviceConfig>>({
    'BSLK-001': {
      accentColor: "#44d62c",
      brightness: 100,
      pollRate: "1000Hz",
      dpiStages: [
        { stage: 1, value: 400, active: true },
        { stage: 2, value: 800, active: true },
        { stage: 3, value: 1600, active: true },
        { stage: 4, value: 3200, active: true },
        { stage: 5, value: 6400, active: true },
      ],
      activeDpiStage: 3
    }
  });

  const [isTauri, setIsTauri] = useState(false);
  const [activeTab, setActiveTab] = useState<'lighting' | 'performance' | 'compatibility' | 'keybinds'>('lighting');
  const [searchQuery, setSearchQuery] = useState("");
  const [keybinds, setKeybinds] = useState([
    { id: '1', key: 'M1', action: 'Launch RazerCtrl', type: 'Macro' },
    { id: '2', key: 'M2', action: 'Toggle Dark Mode', type: 'System' },
    { id: '3', key: 'M3', action: 'Volume Up', type: 'Media' },
  ]);

  // Helper to get current device config
  const currentConfig = selectedDevice ? deviceConfigs[selectedDevice.serial] || {
    accentColor: "#44d62c",
    brightness: 100,
    pollRate: "1000Hz",
    dpiStages: [
      { stage: 1, value: 400, active: true },
      { stage: 2, value: 800, active: true },
      { stage: 3, value: 1600, active: true },
      { stage: 4, value: 3200, active: true },
      { stage: 5, value: 6400, active: true },
    ],
    activeDpiStage: 3
  } : null;

  const updateConfig = (updates: Partial<DeviceConfig>) => {
    if (!selectedDevice) return;
    setDeviceConfigs(prev => ({
      ...prev,
      [selectedDevice.serial]: {
        ...(prev[selectedDevice.serial] || {
          accentColor: "#44d62c",
          brightness: 100,
          pollRate: "1000Hz",
          dpiStages: [
            { stage: 1, value: 400, active: true },
            { stage: 2, value: 800, active: true },
            { stage: 3, value: 1600, active: true },
            { stage: 4, value: 3200, active: true },
            { stage: 5, value: 6400, active: true },
          ],
          activeDpiStage: 3
        }),
        ...updates
      }
    }));
  };

  const exportProfile = () => {
    if (!selectedDevice || !currentConfig) return;

    const profileData = {
      deviceName: selectedDevice.name,
      serial: selectedDevice.serial,
      pid: selectedDevice.pid,
      config: currentConfig,
      keybinds: keybinds, // Including global keybinds for now as requested
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };

    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `razer-profile-${selectedDevice.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const scanDevices = async () => {
    // @ts-ignore
    if (!window.__TAURI__) return;
    
    setIsScanning(true);
    setDaemonStatus('scanning');
    try {
      const fetchedDevices = await invoke<Device[]>('get_devices');
      setLastScanned(new Date());
      setDaemonStatus('connected');
      if (fetchedDevices && fetchedDevices.length > 0) {
        setDevices(fetchedDevices);
        // Auto-select first device if none selected
        setSelectedDevice(prev => prev || fetchedDevices[0]);
      }
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      setDaemonStatus('error');
    } finally {
      setIsScanning(false);
    }
  };

  // Check if running in Tauri and scan for devices
  useEffect(() => {
    // @ts-ignore
    if (window.__TAURI__) {
      setIsTauri(true);
      
      // Initial scan
      scanDevices();

      // Periodic scan every 5 seconds
      const interval = setInterval(scanDevices, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const addDpiStage = () => {
    if (!currentConfig || currentConfig.dpiStages.length >= 5) return;
    const nextStage = currentConfig.dpiStages.length + 1;
    const lastValue = currentConfig.dpiStages[currentConfig.dpiStages.length - 1]?.value || 800;
    updateConfig({
      dpiStages: [...currentConfig.dpiStages, { stage: nextStage, value: lastValue + 400, active: true }]
    });
  };

  const removeDpiStage = (stageNum: number) => {
    if (!currentConfig || currentConfig.dpiStages.length <= 1) return;
    const newStages = currentConfig.dpiStages
      .filter(s => s.stage !== stageNum)
      .map((s, idx) => ({ ...s, stage: idx + 1 }));
    
    let newActive = currentConfig.activeDpiStage;
    if (currentConfig.activeDpiStage === stageNum) {
      newActive = 1;
    } else if (currentConfig.activeDpiStage > stageNum) {
      newActive = currentConfig.activeDpiStage - 1;
    }

    updateConfig({
      dpiStages: newStages,
      activeDpiStage: newActive
    });
  };

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

      <div className="flex max-w-[1400px] mx-auto min-h-[calc(100-64px)]">
        {/* Sidebar */}
        <aside className={`w-72 border-r ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'} p-4 hidden md:block`}>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Connected Devices</h3>
              {isScanning && <RefreshCw className="w-3 h-3 animate-spin text-[#44d62c]" />}
            </div>
            <div className="space-y-1">
              {devices.map((device) => (
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
              {isScanning && devices.length === 0 && (
                <div className="py-8 flex flex-col items-center justify-center gap-3 opacity-50">
                  <RefreshCw className="w-5 h-5 animate-spin text-[#44d62c]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Scanning...</span>
                </div>
              )}
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

          <div className="mt-6 pt-6 border-t border-[#30363d]">
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 px-2 ${isDark ? 'text-[#8b949e]' : 'text-[#57606a]'}`}>Utilities</h3>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('compatibility')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  activeTab === 'compatibility' 
                    ? `bg-[#44d62c]/10 text-[#44d62c] border border-[#44d62c]/20` 
                    : `hover:bg-[#44d62c]/5 ${isDark ? 'text-[#8b949e] hover:text-[#c9d1d9]' : 'text-[#57606a] hover:text-[#24292f]'}`
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Compatibility List</span>
              </button>
              <button
                onClick={scanDevices}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium hover:bg-[#44d62c]/5 ${isDark ? 'text-[#8b949e] hover:text-[#c9d1d9]' : 'text-[#57606a] hover:text-[#24292f]'}`}
              >
                <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                <span>Restart Daemon</span>
              </button>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium hover:bg-[#44d62c]/5 ${isDark ? 'text-[#8b949e] hover:text-[#c9d1d9]' : 'text-[#57606a] hover:text-[#24292f]'}`}
              >
                <Settings className="w-4 h-4" />
                <span>App Settings</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Tabs */}
          <div className="flex gap-1 mb-8 p-1 bg-[#161b22] rounded-xl border border-[#30363d] w-fit">
            {(['lighting', 'performance', 'keybinds', 'compatibility'] as const).map((tab) => (
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
                  
                  {selectedDevice.battery_level !== null && (
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
                                onClick={() => updateConfig({ accentColor: color })}
                                className={`w-12 h-12 rounded-xl border-2 transition-all hover:scale-110 ${currentConfig?.accentColor === color ? 'border-white scale-110 shadow-lg shadow-white/10' : 'border-transparent opacity-60 hover:opacity-100'}`}
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
                            <span className="text-xs font-mono font-bold text-[#44d62c]">{currentConfig?.brightness}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={currentConfig?.brightness || 0}
                            onChange={(e) => updateConfig({ brightness: parseInt(e.target.value) })}
                            className="w-full h-2 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-[#44d62c]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : activeTab === 'keybinds' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className={`p-6 rounded-2xl border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#44d62c]/10 rounded-lg">
                              <Command className="w-5 h-5 text-[#44d62c]" />
                            </div>
                            <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>Key Assignments</h3>
                          </div>
                          <button 
                            onClick={() => {
                              const newBind = { id: Date.now().toString(), key: 'New', action: 'Unassigned', type: 'Macro' };
                              setKeybinds([...keybinds, newBind]);
                            }}
                            className="flex items-center gap-2 text-[10px] font-bold text-[#44d62c] uppercase hover:opacity-80"
                          >
                            <Plus className="w-3 h-3" /> Add Assignment
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {keybinds.map((bind) => (
                            <div key={bind.id} className={`p-4 rounded-xl border ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'} flex items-center justify-between group transition-all hover:border-[#44d62c]/50`}>
                              <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-[#8b949e] uppercase mb-1">Key</span>
                                  <div className={`px-3 py-1.5 rounded-lg border-2 ${isDark ? 'border-[#30363d] bg-[#161b22] text-white' : 'border-[#d0d7de] bg-white text-[#1a1a1a]'} font-mono font-bold text-sm min-w-[60px] text-center`}>
                                    {bind.key}
                                  </div>
                                </div>
                                <div className="w-[1px] h-10 bg-[#30363d]" />
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-[#8b949e] uppercase mb-1">Action</span>
                                  <span className="text-sm font-bold text-white">{bind.action}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold text-[#8b949e] uppercase mb-1">Type</span>
                                  <div className="flex items-center gap-1.5">
                                    {bind.type === 'Macro' ? <Type className="w-3 h-3 text-[#44d62c]" /> : <Activity className="w-3 h-3 text-blue-400" />}
                                    <span className="text-[10px] font-bold text-[#8b949e]">{bind.type}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#30363d]' : 'hover:bg-[#ebecf0]'} text-[#8b949e] hover:text-white transition-colors`}>
                                  <Settings className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setKeybinds(keybinds.filter(k => k.id !== bind.id))}
                                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#30363d]' : 'hover:bg-[#ebecf0]'} text-red-500 hover:text-red-400 transition-colors`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'} flex items-start gap-4`}>
                        <div className="p-2 bg-[#44d62c]/10 rounded-lg">
                          <Zap className="w-5 h-5 text-[#44d62c]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase mb-1">Macro Engine v2.0</h4>
                          <p className="text-[11px] leading-relaxed text-[#8b949e]">
                            Macros are executed directly on the device hardware where supported, or via the high-performance Rust daemon for legacy devices. 
                            Complex combinations and timing delays are fully supported.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                      {/* DPI Stages - Only for Mice */}
                      {selectedDevice?.device_type.toLowerCase().includes('mouse') ? (
                        <div className={`p-6 rounded-2xl border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#44d62c]/10 rounded-lg">
                                <Activity className="w-5 h-5 text-[#44d62c]" />
                              </div>
                              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>DPI Stages</h3>
                            </div>
                            <div className="flex gap-4">
                              <button 
                                onClick={addDpiStage}
                                disabled={!currentConfig || currentConfig.dpiStages.length >= 5}
                                className="flex items-center gap-2 text-[10px] font-bold text-[#44d62c] uppercase hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-3 h-3" /> Add Stage
                              </button>
                            </div>
                          </div>

                          <div className="space-y-6">
                            {currentConfig?.dpiStages.map((stage) => (
                              <div key={stage.stage} className="flex items-center gap-4 group">
                                <button 
                                  onClick={() => updateConfig({ activeDpiStage: stage.stage })}
                                  className={`w-10 h-10 rounded-xl text-xs font-bold flex items-center justify-center border-2 transition-all ${
                                    currentConfig.activeDpiStage === stage.stage 
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
                                      const newStages = [...currentConfig.dpiStages];
                                      newStages[stage.stage - 1].value = parseInt(e.target.value);
                                      updateConfig({ dpiStages: newStages });
                                    }}
                                    className="w-full h-1.5 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-[#44d62c]"
                                  />
                                </div>
                                <div className="w-20 text-right flex items-center justify-end gap-3">
                                  <span className={`text-sm font-mono font-bold ${currentConfig.activeDpiStage === stage.stage ? 'text-[#44d62c]' : 'text-[#8b949e]'}`}>
                                    {stage.value}
                                  </span>
                                  <button 
                                    onClick={() => removeDpiStage(stage.stage)}
                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity"
                                    title="Remove Stage"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className={`p-6 rounded-2xl border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm flex flex-col items-center justify-center text-center`}>
                          <MousePointer2 className="w-10 h-10 text-[#8b949e] mb-4 opacity-20" />
                          <h3 className="font-bold mb-1">No DPI Controls</h3>
                          <p className="text-xs text-[#8b949e]">DPI stages are only available for Razer mice.</p>
                        </div>
                      )}

                      {/* Polling Rate & Info */}
                      <div className="space-y-6">
                        <div className={`p-6 rounded-2xl border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                          <label className="text-xs font-bold text-[#8b949e] uppercase mb-6 block">Polling Rate</label>
                          <div className="grid grid-cols-2 gap-3">
                            {['125Hz', '500Hz', '1000Hz', '8000Hz'].map((rate) => (
                              <button
                                key={rate}
                                onClick={() => updateConfig({ pollRate: rate })}
                                className={`px-4 py-4 rounded-xl text-sm font-bold transition-all border-2 ${
                                  currentConfig?.pollRate === rate 
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
                <div className="mt-12 pt-8 border-t border-[#30363d] flex flex-col xl:flex-row items-center justify-between gap-6">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">
                      <Cpu className={`w-3.5 h-3.5 ${daemonStatus === 'connected' ? 'text-[#44d62c]' : daemonStatus === 'error' ? 'text-red-500' : 'text-yellow-500 animate-pulse'}`} />
                      <span>Daemon: <span className={isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}>{daemonStatus.toUpperCase()}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">
                      <Wifi className="w-3.5 h-3.5 text-[#44d62c]" />
                      <span>Devices: <span className={isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}>{devices.length} Active</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">
                      <Clock className="w-3.5 h-3.5 text-[#44d62c]" />
                      <span>Last Scan: <span className={isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}>{lastScanned.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#8b949e]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#44d62c]" />
                      <span>Driver: <span className={isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}>v3.12.0</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={exportProfile}
                      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isDark ? 'bg-[#21262d] hover:bg-[#30363d] text-white' : 'bg-[#f3f4f6] hover:bg-[#ebecf0] text-[#24292f]'}`}
                    >
                      <Share className="w-4 h-4" />
                      Export Profile
                    </button>
                    <button 
                      onClick={() => {
                        if (!selectedDevice) return;
                        const defaultConfig: DeviceConfig = {
                          accentColor: "#44d62c",
                          brightness: 100,
                          pollRate: "1000Hz",
                          dpiStages: [
                            { stage: 1, value: 400, active: true },
                            { stage: 2, value: 800, active: true },
                            { stage: 3, value: 1600, active: true },
                            { stage: 4, value: 3200, active: true },
                            { stage: 5, value: 6400, active: true },
                          ],
                          activeDpiStage: 3
                        };
                        updateConfig(defaultConfig);
                      }}
                      className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${isDark ? 'bg-[#21262d] hover:bg-[#30363d] text-white' : 'bg-[#f3f4f6] hover:bg-[#ebecf0] text-[#24292f]'}`}
                    >
                      Reset to Default
                    </button>
                    <button 
                      onClick={() => {
                        // Logic to save to backend would go here
                        // For now, we'll just show a brief success state
                        const btn = document.getElementById('save-profile-btn');
                        if (btn) {
                          const originalText = btn.innerText;
                          btn.innerText = 'SAVED!';
                          btn.classList.add('bg-white', 'text-black');
                          setTimeout(() => {
                            btn.innerText = originalText;
                            btn.classList.remove('bg-white', 'text-black');
                          }, 2000);
                        }
                      }}
                      id="save-profile-btn"
                      className="px-8 py-2.5 bg-[#44d62c] hover:bg-[#38b324] text-black rounded-lg text-sm font-bold transition-all shadow-lg shadow-[#44d62c]/20"
                    >
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
