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
  Share,
  LayoutGrid
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
  programmableKeys?: number;
  imageUrl?: string;
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
  { name: "Razer Basilisk V3", serial: "BSLK-001", device_type: "mouse", battery_level: 85, is_charging: false, pid: "1532:0099", programmableKeys: 11, imageUrl: "https://picsum.photos/seed/RazerBasiliskV3Topo/800/600?grayscale&blur=2" },
  { name: "Razer BlackWidow V4", serial: "BW-002", device_type: "keyboard", battery_level: null, is_charging: false, pid: "1532:0287", programmableKeys: 104, imageUrl: "https://picsum.photos/seed/RazerBlackWidowV4Topo/800/600?grayscale&blur=2" },
  { name: "Razer Tartarus Pro", serial: "TT-004", device_type: "keypad", battery_level: null, is_charging: false, pid: "1532:0244", programmableKeys: 32, imageUrl: "https://picsum.photos/seed/RazerTartarusProTopo/800/600?grayscale&blur=2" },
  { name: "Razer BlackShark V2 Pro", serial: "BS-003", device_type: "headset", battery_level: 42, is_charging: true, pid: "1532:0527", programmableKeys: 3, imageUrl: "https://picsum.photos/seed/RazerBlackSharkV2ProTopo/800/600?grayscale&blur=2" },
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(MOCK_DEVICES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [daemonStatus, setDaemonStatus] = useState<'connected' | 'error' | 'scanning'>('connected');
  const [lastScanned, setLastScanned] = useState<Date>(new Date());
  const [isHypershift, setIsHypershift] = useState(false);
  const [activeProfile, setActiveProfile] = useState("Default");
  
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customize' | 'lighting' | 'performance' | 'audio' | 'assets' | 'compatibility'>('dashboard');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState("Wave");
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

  const getDeviceIcon = (type: string, className: string = "w-4 h-4") => {
    const t = type.toLowerCase();
    if (t.includes('mousemat')) return <Palette className={className} />;
    if (t.includes('mouse')) return <MousePointer2 className={className} />;
    if (t.includes('keyboard')) return <Keyboard className={className} />;
    if (t.includes('headset')) return <Headphones className={className} />;
    if (t.includes('keypad')) return <Command className={className} />;
    if (t.includes('misc')) return <Settings className={className} />;
    return <Zap className={className} />;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0d1117] text-[#c9d1d9]' : 'bg-[#f6f8fa] text-[#24292f]'} font-sans selection:bg-[#44d62c] selection:text-black overflow-hidden flex flex-col`}>
      {/* Top Utility Bar */}
      <div className={`h-8 border-b ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'} flex items-center justify-between px-4 text-[10px] font-bold uppercase tracking-widest text-[#8b949e]`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#44d62c]">
            <ShieldCheck className="w-3 h-3" />
            <span>Synapse</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
            <Activity className="w-3 h-3" />
            <span>Macro</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
            <Zap className="w-3 h-3" />
            <span>Linked Games</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="hover:text-white transition-colors">
            {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          </button>
          <Settings className="w-3 h-3 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Main Header */}
      <header className={`border-b ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} px-6 py-3 flex items-center justify-between z-20`}>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#44d62c] rounded flex items-center justify-center shadow-lg shadow-[#44d62c]/20">
              <ShieldCheck className="text-black w-5 h-5" />
            </div>
            <h1 className={`text-lg font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>RAZERCTRL</h1>
          </div>
          
          <nav className="flex gap-1">
            {(['dashboard', 'customize', 'performance', 'lighting', 'audio', 'assets', 'compatibility'] as const).map((tab) => {
              if (tab === 'audio' && selectedDevice?.device_type !== 'headset') return null;
              if (['customize', 'performance', 'lighting', 'audio'].includes(tab) && !selectedDevice) return null;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? 'bg-[#44d62c] text-black' 
                      : 'text-[#8b949e] hover:text-white hover:bg-[#30363d]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded text-[10px] font-bold text-[#8b949e]">
            <div className="w-2 h-2 rounded-full bg-[#44d62c] animate-pulse" />
            ONLINE
          </div>
        </div>
      </header>

      {/* Device Image Selector Bar */}
      <div className={`border-b ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'} px-6 py-4 flex items-center justify-center gap-6 z-10 shadow-sm`}>
        {devices.map(device => (
          <div
            key={device.serial}
            onClick={() => { 
              setSelectedDevice(device); 
              if (activeTab === 'dashboard' || activeTab === 'assets' || activeTab === 'compatibility') {
                setActiveTab('customize');
              }
            }}
            className="relative group flex flex-col items-center"
          >
            <div
              className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 w-32 h-32 flex flex-col items-center justify-center overflow-hidden ${
                selectedDevice?.serial === device.serial 
                  ? 'border-[#44d62c] shadow-[0_0_15px_rgba(68,214,44,0.15)] bg-[#161b22]' 
                  : 'border-transparent hover:border-[#30363d] bg-[#161b22] opacity-70 hover:opacity-100'
              }`}
            >
              {device.imageUrl && (
                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity" style={{ backgroundImage: `url(${device.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'luminosity' }} />
              )}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedDevice?.serial === device.serial ? 'text-[#44d62c]' : 'text-[#8b949e] group-hover:text-white'}`}>
                  {getDeviceIcon(device.device_type, "w-10 h-10")}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest text-center px-2 ${selectedDevice?.serial === device.serial ? 'text-white' : 'text-[#8b949e] group-hover:text-white'}`}>
                  {device.device_type}
                </span>
              </div>
              {selectedDevice?.serial === device.serial && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#44d62c]" />
              )}
            </div>
            
            {/* Tooltip */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#30363d] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {device.name}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-64 border-r ${isDark ? 'border-[#30363d] bg-[#0d1117]' : 'border-[#d0d7de] bg-[#f6f8fa]'} flex flex-col`}>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">Profiles</h3>
              {isScanning && <RefreshCw className="w-3 h-3 animate-spin text-[#44d62c]" />}
            </div>
            <div className="space-y-2">
              {['Default', 'Gaming', 'Productivity', 'Streaming'].map(profile => (
                <button 
                  key={profile}
                  onClick={() => setActiveProfile(profile)}
                  className={`w-full text-left px-3 py-2 rounded text-[11px] font-bold transition-all ${activeProfile === profile ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-white'}`}
                >
                  {profile}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-hidden flex flex-col">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#44d62c 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          <div className="flex-1 overflow-y-auto p-8 relative z-10">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' ? (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight text-white">DASHBOARD</h2>
                    <div className="flex items-center gap-2 text-[10px] font-black text-[#8b949e] uppercase tracking-widest">
                      <LayoutGrid className="w-3 h-3" />
                      <span>Grid View</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devices.map(device => (
                      <div 
                        key={device.serial}
                        onClick={() => { setSelectedDevice(device); setActiveTab('customize'); }}
                        className="group relative bg-[#161b22] border border-[#30363d] rounded-lg p-6 hover:border-[#44d62c] transition-all cursor-pointer overflow-hidden"
                      >
                        {device.imageUrl && (
                          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundImage: `url(${device.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'luminosity' }} />
                        )}
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                          {getDeviceIcon(device.device_type)}
                        </div>
                        <div className="relative z-10">
                          <h3 className="text-lg font-black text-white mb-1 group-hover:text-[#44d62c] transition-colors">{device.name}</h3>
                          <div className="flex items-center gap-2 mb-6">
                            <p className="text-[10px] font-mono text-[#8b949e] uppercase tracking-widest">{device.device_type}</p>
                            {device.programmableKeys && (
                              <span className="bg-[#44d62c]/10 text-[#44d62c] px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-[#44d62c]/30">
                                {device.programmableKeys} Keys
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#44d62c]" />
                              <span className="text-[10px] font-black text-[#44d62c] uppercase tracking-widest">Connected</span>
                            </div>
                            {device.battery_level !== null && (
                              <div className="flex items-center gap-1 text-[10px] font-black text-[#8b949e]">
                                <Battery className="w-3 h-3" />
                                <span>{device.battery_level}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 bg-[#44d62c] transition-all duration-500 w-0 group-hover:w-full" />
                      </div>
                    ))}
                    
                    <div className="bg-[#0d1117] border border-[#30363d] border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                      <Plus className="w-8 h-8 text-[#8b949e]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">Add New Module</span>
                    </div>
                  </div>
                </motion.div>
              ) : activeTab === 'assets' ? (
                <motion.div
                  key="assets"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black tracking-tight text-white">ASSET WORKSHOP</h2>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8b949e]" />
                        <input 
                          type="text" 
                          placeholder="SEARCH ASSETS..."
                          className="bg-[#0d1117] border border-[#30363d] rounded px-8 py-1.5 text-[10px] font-bold text-white outline-none focus:border-[#44d62c] w-64"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Cyberpunk 2077', type: 'Lighting Profile', author: 'Razer Official', downloads: '1.2M' },
                      { name: 'Competitive FPS', type: 'Performance Profile', author: 'ProGamer99', downloads: '450K' },
                      { name: 'Rainbow Wave v2', type: 'Chroma Effect', author: 'LightMaster', downloads: '890K' },
                      { name: 'Stream Deck Macros', type: 'Macro Pack', author: 'StreamerTools', downloads: '120K' },
                      { name: 'Minimalist White', type: 'Lighting Profile', author: 'CleanSetup', downloads: '340K' },
                      { name: 'MMO Skill Rotation', type: 'Macro Pack', author: 'RaidLeader', downloads: '67K' },
                    ].map((asset, i) => (
                      <div key={i} className="bg-[#161b22] border border-[#30363d] rounded overflow-hidden group hover:border-[#44d62c] transition-all">
                        <div className="h-32 bg-[#0d1117] relative flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity" style={{ background: `linear-gradient(45deg, ${['#44d62c', '#ff0000', '#0000ff', '#ff00ff'][i % 4]}, transparent)` }} />
                          <Download className="w-8 h-8 text-[#8b949e] group-hover:text-white transition-colors" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[8px] font-black text-[#44d62c] uppercase tracking-widest">{asset.type}</span>
                            <span className="text-[8px] font-mono text-[#8b949e]">{asset.downloads}</span>
                          </div>
                          <h4 className="text-[11px] font-black text-white mb-1">{asset.name}</h4>
                          <p className="text-[9px] text-[#8b949e]">by {asset.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : activeTab === 'compatibility' ? (
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
                    <div key={device.id} className="p-4 rounded border border-[#30363d] bg-[#161b22] hover:border-[#44d62c] transition-colors group">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-[#44d62c]/10 rounded text-[#44d62c]">
                            {getDeviceIcon(device.category)}
                          </div>
                          <span className="text-[10px] font-black text-[#44d62c] uppercase tracking-widest">{device.category}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#8b949e]">{device.id}</span>
                      </div>
                      <h4 className="text-[11px] font-black text-white group-hover:text-[#44d62c] transition-colors">{device.name}</h4>
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
                <div className="flex items-center justify-between mb-8 bg-[#161b22] p-4 rounded border border-[#30363d]">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#8b949e] mb-1">Profile</span>
                      <select 
                        value={activeProfile}
                        onChange={(e) => setActiveProfile(e.target.value)}
                        className="bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-[11px] font-bold text-white outline-none focus:border-[#44d62c]"
                      >
                        {['Default', 'Gaming', 'Productivity', 'Streaming'].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="w-[1px] h-8 bg-[#30363d]" />
                    <div>
                      <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                        {selectedDevice.name.toUpperCase()}
                      </h2>
                      <p className="text-[10px] text-[#8b949e] font-mono uppercase tracking-widest">SN: {selectedDevice.serial}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {selectedDevice.battery_level !== null && (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#8b949e] mb-1">Battery</span>
                        <div className="flex items-center gap-2">
                          {selectedDevice.is_charging ? <BatteryCharging className="w-3 h-3 text-[#44d62c]" /> : <Battery className="w-3 h-3 text-[#8b949e]" />}
                          <span className="text-[11px] font-black">{selectedDevice.battery_level}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Control Grid */}
                <div className="flex-1">
                  {activeTab === 'lighting' ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex gap-6"
                    >
                      {/* Effect Layer Sidebar */}
                      <div className="w-64 bg-[#161b22] rounded border border-[#30363d] flex flex-col">
                        <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">Effect Layer</span>
                          <Plus className="w-3 h-3 text-[#44d62c] cursor-pointer" />
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                          {['Wave', 'Static', 'Ambient Awareness', 'Fire', 'Reactive'].map(effect => (
                            <div 
                              key={effect}
                              onClick={() => setSelectedEffect(effect)}
                              className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-all ${selectedEffect === effect ? 'bg-[#30363d] text-white' : 'text-[#8b949e] hover:text-white'}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${selectedEffect === effect ? 'bg-[#44d62c]' : 'bg-[#30363d]'}`} />
                                <span className="text-[11px] font-bold">{effect}</span>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                                <Sun className="w-3 h-3" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-6">
                        <div className="flex-1 relative bg-[#0d1117] rounded border border-[#30363d] overflow-hidden flex items-center justify-center">
                          {selectedDevice.imageUrl && (
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url(${selectedDevice.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'luminosity' }} />
                          )}
                          {/* Device Silhouette Concept */}
                          <div className="relative w-96 h-96 flex items-center justify-center z-10">
                            <div className={`absolute inset-0 blur-3xl opacity-20 transition-colors duration-500`} style={{ backgroundColor: currentConfig?.accentColor }} />
                            {selectedDevice.device_type === 'mouse' ? (
                              <MousePointer2 className="w-64 h-64 text-white/10" strokeWidth={0.5} />
                            ) : selectedDevice.device_type === 'keyboard' ? (
                              <Keyboard className="w-80 h-80 text-white/10" strokeWidth={0.5} />
                            ) : (
                              <Zap className="w-64 h-64 text-white/10" strokeWidth={0.5} />
                            )}
                            
                            {/* Accent Glow Points */}
                            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full shadow-[0_0_15px_rgba(68,214,44,0.8)]" style={{ backgroundColor: currentConfig?.accentColor }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className={`p-6 rounded border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                            <label className="text-[10px] font-black text-[#8b949e] uppercase mb-6 block tracking-widest">Properties</label>
                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <span className="text-[10px] font-bold text-[#8b949e]">Speed</span>
                                <span className="text-[10px] font-bold text-[#44d62c]">15</span>
                              </div>
                              <input type="range" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#44d62c]" />
                            </div>
                          </div>

                          <div className={`p-6 rounded border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                            <div className="flex justify-between mb-6">
                              <label className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Brightness</label>
                              <span className="text-[10px] font-mono font-black text-[#44d62c]">{currentConfig?.brightness}%</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={currentConfig?.brightness || 0}
                              onChange={(e) => updateConfig({ brightness: parseInt(e.target.value) })}
                              className="w-full h-1 bg-[#30363d] rounded appearance-none cursor-pointer accent-[#44d62c]"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : activeTab === 'customize' ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex gap-6"
                    >
                      {/* Action Selection Sidebar */}
                      <div className="w-64 bg-[#161b22] rounded border border-[#30363d] flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#8b949e]">
                            {selectedKey ? `Button: ${selectedKey}` : 'Select a Button'}
                          </span>
                          {selectedKey && <Trash2 className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setSelectedKey(null)} />}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                          {selectedKey ? (
                            <div className="space-y-4">
                              <div>
                                <label className="text-[9px] font-black text-[#8b949e] uppercase mb-2 block">Function</label>
                                <select className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-[11px] font-bold text-white outline-none">
                                  <option>Keyboard Function</option>
                                  <option>Mouse Function</option>
                                  <option>Macro</option>
                                  <option>Multimedia</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[9px] font-black text-[#8b949e] uppercase mb-2 block">Key Assignment</label>
                                <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded text-center text-white font-black text-xl">
                                  {keybinds.find(k => k.key === selectedKey)?.action || 'NONE'}
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <button className="flex-1 py-2 bg-[#30363d] rounded text-[10px] font-black uppercase tracking-widest text-white">Cancel</button>
                                <button className="flex-1 py-2 bg-[#44d62c] rounded text-[10px] font-black uppercase tracking-widest text-black">Save</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                              <MousePointer className="w-12 h-12 mb-4" />
                              <p className="text-[10px] font-bold">Click a button on the device to remap</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col gap-6">
                        <div className="flex-1 relative bg-[#0d1117] rounded border border-[#30363d] flex items-center justify-center overflow-hidden">
                          {selectedDevice.imageUrl && (
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url(${selectedDevice.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'luminosity' }} />
                          )}
                          
                          {selectedDevice.programmableKeys && (
                            <div className="absolute top-4 right-4 bg-[#161b22]/80 backdrop-blur border border-[#44d62c] px-3 py-1.5 rounded text-[10px] font-black text-[#44d62c] uppercase tracking-widest shadow-[0_0_10px_rgba(68,214,44,0.2)] z-20">
                              {selectedDevice.programmableKeys} Programmable Keys
                            </div>
                          )}

                          {/* Device Map Concept */}
                          <div className="relative w-full h-full flex items-center justify-center p-12 z-10">
                             <div className="relative">
                                {selectedDevice.device_type === 'mouse' ? (
                                  <div className="relative">
                                    <MousePointer2 className="w-48 h-48 text-[#30363d]" strokeWidth={1} />
                                    {/* Highlight dots for mouse */}
                                    {Array.from({ length: Math.min(selectedDevice.programmableKeys || 6, 15) }).map((_, i) => (
                                      <div key={i} className="absolute w-2 h-2 bg-[#44d62c] rounded-full shadow-[0_0_8px_rgba(68,214,44,0.8)] animate-pulse" style={{
                                        top: `${20 + (i * 15) % 60}%`,
                                        left: `${30 + (i * 25) % 40}%`,
                                        animationDelay: `${i * 0.2}s`
                                      }} />
                                    ))}
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <Keyboard className="w-64 h-64 text-[#30363d]" strokeWidth={1} />
                                    {/* Highlight dots for keyboard (simplified grid) */}
                                    <div className="absolute inset-0 top-1/4 left-1/4 right-1/4 bottom-1/4 grid grid-cols-8 gap-2 opacity-50">
                                      {Array.from({ length: Math.min(selectedDevice.programmableKeys || 104, 32) }).map((_, i) => (
                                        <div key={i} className="w-1.5 h-1.5 bg-[#44d62c] rounded-full shadow-[0_0_5px_rgba(68,214,44,0.8)]" style={{ animation: `pulse 2s infinite ${i * 0.05}s` }} />
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Mapping Points */}
                                {keybinds.slice(0, 5).map((bind, i) => (
                                  <div key={bind.id} className="absolute" style={{ 
                                    top: `${20 + i * 15}%`, 
                                    left: i % 2 === 0 ? '-140px' : 'auto',
                                    right: i % 2 !== 0 ? '-120px' : 'auto'
                                  }}>
                                    <div className="flex items-center gap-3">
                                      {i % 2 !== 0 && <div className="w-8 h-[1px] bg-[#44d62c]" />}
                                      <div 
                                        onClick={() => setSelectedKey(bind.key)}
                                        className={`bg-[#161b22] border px-3 py-1.5 rounded min-w-[100px] hover:border-[#44d62c] cursor-pointer transition-all group ${selectedKey === bind.key ? 'border-[#44d62c] ring-1 ring-[#44d62c]' : 'border-[#30363d]'}`}
                                      >
                                        <div className="text-[8px] font-black text-[#8b949e] uppercase mb-0.5">{bind.key}</div>
                                        <div className="text-[10px] font-bold text-white group-hover:text-[#44d62c] truncate">{bind.action}</div>
                                      </div>
                                      {i % 2 === 0 && <div className="w-8 h-[1px] bg-[#44d62c]" />}
                                    </div>
                                  </div>
                                ))}
                             </div>
                          </div>

                          {/* Hypershift Toggle */}
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#161b22] p-1 rounded border border-[#30363d]">
                            <button 
                              onClick={() => setIsHypershift(false)}
                              className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${!isHypershift ? 'bg-[#44d62c] text-black' : 'text-[#8b949e] hover:text-white'}`}
                            >
                              Standard
                            </button>
                            <button 
                              onClick={() => setIsHypershift(true)}
                              className={`px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition-all ${isHypershift ? 'bg-[#44d62c] text-black' : 'text-[#8b949e] hover:text-white'}`}
                            >
                              Hypershift
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : activeTab === 'audio' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="h-full flex flex-col gap-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className={`p-6 rounded border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                          <div className="flex items-center justify-between mb-8">
                            <label className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Enhancements</label>
                            <div className="w-8 h-4 bg-[#30363d] rounded-full relative cursor-pointer">
                              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-[#44d62c] rounded-full" />
                            </div>
                          </div>
                          <div className="space-y-6">
                            {['Bass Boost', 'Sound Normalization', 'Voice Clarity'].map(enhancement => (
                              <div key={enhancement} className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-[11px] font-bold text-white">{enhancement}</span>
                                  <span className="text-[10px] font-mono text-[#44d62c]">55</span>
                                </div>
                                <input type="range" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#44d62c]" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={`p-6 rounded border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                          <label className="text-[10px] font-black text-[#8b949e] uppercase mb-8 block tracking-widest">Audio Equalizer</label>
                          <div className="flex items-end justify-between h-48 gap-2">
                            {[12, 8, 4, 0, -4, -8, -12, -8, -4, 0].map((val, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-1 flex-1 bg-[#30363d] rounded-full relative">
                                  <div 
                                    className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-[#44d62c] rounded-full shadow-[0_0_10px_rgba(68,214,44,0.5)]" 
                                    style={{ bottom: `${((val + 12) / 24) * 100}%` }}
                                  />
                                </div>
                                <span className="text-[8px] font-mono text-[#8b949e]">{31 * Math.pow(2, i)}Hz</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : activeTab === 'performance' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="h-full flex flex-col gap-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* DPI Stages - Only for Mice */}
                        {selectedDevice?.device_type.toLowerCase().includes('mouse') ? (
                          <div className={`p-6 rounded border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                            <div className="flex items-center justify-between mb-8">
                              <h3 className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">DPI Stages</h3>
                              <button 
                                onClick={addDpiStage}
                                disabled={!currentConfig || currentConfig.dpiStages.length >= 5}
                                className="text-[9px] font-black text-[#44d62c] uppercase tracking-widest hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                + Add Stage
                              </button>
                            </div>
                            
                            <div className="space-y-4">
                              {currentConfig?.dpiStages.map((stage) => (
                                <div key={stage.stage} className={`flex items-center gap-4 p-3 rounded border transition-all ${currentConfig.activeDpiStage === stage.stage ? 'border-[#44d62c] bg-[#44d62c]/5' : 'border-[#30363d] bg-[#0d1117]'}`}>
                                  <div 
                                    onClick={() => updateConfig({ activeDpiStage: stage.stage })}
                                    className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-black cursor-pointer transition-all ${currentConfig.activeDpiStage === stage.stage ? 'bg-[#44d62c] text-black' : 'bg-[#161b22] text-[#8b949e]'}`}
                                  >
                                    {stage.stage}
                                  </div>
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
                                      className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#44d62c]"
                                    />
                                  </div>
                                  <span className="text-[11px] font-mono font-black text-white min-w-[50px] text-right">{stage.value}</span>
                                  <button 
                                    onClick={() => removeDpiStage(stage.stage)}
                                    className="text-red-500 opacity-30 hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : selectedDevice?.device_type.toLowerCase().includes('keypad') ? (
                          <div className={`p-6 rounded border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                            <h3 className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest mb-8">Analog Actuation</h3>
                            <div className="space-y-8">
                              <div className="flex items-center justify-center h-48 relative">
                                <div className="w-12 h-40 bg-[#0d1117] border border-[#30363d] rounded-lg relative overflow-hidden">
                                  <div 
                                    className="absolute bottom-0 left-0 right-0 bg-[#44d62c] transition-all duration-300" 
                                    style={{ height: '35%' }}
                                  />
                                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20" />
                                </div>
                                <div className="absolute right-12 text-[10px] font-black text-[#44d62c] uppercase tracking-widest">Actuation Point: 1.5mm</div>
                              </div>
                              <input type="range" className="w-full h-1 bg-[#30363d] rounded appearance-none accent-[#44d62c]" />
                            </div>
                          </div>
                        ) : (
                          <div className={`p-6 rounded border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm flex flex-col items-center justify-center text-center opacity-50`}>
                            <Zap className="w-12 h-12 mb-4 text-[#8b949e]" />
                            <h3 className="text-[10px] font-black text-[#8b949e] uppercase tracking-widest">Performance Controls</h3>
                            <p className="text-[10px] mt-2">No specific performance settings for this device.</p>
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
                      </div>
                    </motion.div>
                  ) : null}
                </div>

                {/* Footer Info */}
                <div className={`mt-auto pt-8 border-t border-[#30363d] flex flex-col xl:flex-row items-center justify-between gap-6`}>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#8b949e]">
                      <Cpu className={`w-3 h-3 ${daemonStatus === 'connected' ? 'text-[#44d62c]' : daemonStatus === 'error' ? 'text-red-500' : 'text-yellow-500 animate-pulse'}`} />
                      <span>Daemon: <span className={isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}>{daemonStatus.toUpperCase()}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#8b949e]">
                      <Wifi className="w-3 h-3 text-[#44d62c]" />
                      <span>Devices: <span className={isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}>{devices.length} Active</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#8b949e]">
                      <Clock className="w-3 h-3 text-[#44d62c]" />
                      <span>Last Scan: <span className={isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}>{lastScanned.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#8b949e]">
                      <ShieldCheck className="w-3 h-3 text-[#44d62c]" />
                      <span>Driver: <span className={isDark ? 'text-[#c9d1d9]' : 'text-[#24292f]'}>v3.12.0</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={exportProfile}
                      className={`px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isDark ? 'bg-[#21262d] hover:bg-[#30363d] text-white' : 'bg-[#f3f4f6] hover:bg-[#ebecf0] text-[#24292f]'}`}
                    >
                      <Share className="w-3 h-3" />
                      Export
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
                      className={`px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-[#21262d] hover:bg-[#30363d] text-white' : 'bg-[#f3f4f6] hover:bg-[#ebecf0] text-[#24292f]'}`}
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => {
                        const btn = document.getElementById('save-profile-btn');
                        if (btn) {
                          const originalText = btn.innerText;
                          btn.innerText = 'SAVED';
                          btn.classList.add('bg-white', 'text-black');
                          setTimeout(() => {
                            btn.innerText = originalText;
                            btn.classList.remove('bg-white', 'text-black');
                          }, 2000);
                        }
                      }}
                      id="save-profile-btn"
                      className="px-6 py-2 bg-[#44d62c] hover:bg-[#38b324] text-black rounded text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#44d62c]/20"
                    >
                      Save
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
          </div>
        </main>
      </div>
    </div>
  );
}
