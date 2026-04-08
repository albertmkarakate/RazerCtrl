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

// --- Types ---
interface Device {
  name: string;
  serial: string;
  device_type: string;
  battery_level?: number | null;
  is_charging: boolean;
}

// --- Mock Data (for preview) ---
const MOCK_DEVICES: Device[] = [
  { name: "Razer Basilisk V3", serial: "BSLK-001", device_type: "mouse", battery_level: 85, is_charging: false },
  { name: "Razer BlackWidow V4", serial: "BW-002", device_type: "keyboard", battery_level: null, is_charging: false },
  { name: "Razer BlackShark V2 Pro", serial: "BS-003", device_type: "headset", battery_level: 42, is_charging: true },
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(MOCK_DEVICES[0]);
  const [accentColor, setAccentColor] = useState("#44d62c");
  const [brightness, setBrightness] = useState(100);
  const [pollRate, setPollRate] = useState("1000Hz");
  const [isTauri, setIsTauri] = useState(false);

  // Check if running in Tauri
  useEffect(() => {
    // @ts-ignore
    if (window.__TAURI__) {
      setIsTauri(true);
    }
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mouse': return <MousePointer2 className="w-5 h-5" />;
      case 'keyboard': return <Keyboard className="w-5 h-5" />;
      case 'headset': return <Headphones className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
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
                  {getDeviceIcon(device.device_type)}
                  <span className="truncate">{device.name}</span>
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
          <AnimatePresence mode="wait">
            {selectedDevice ? (
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
                    <p className="text-sm text-[#8b949e] mt-1 font-mono uppercase">Serial: {selectedDevice.serial}</p>
                  </div>
                  
                  {selectedDevice.battery_level != null && (
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'}`}>
                      {selectedDevice.is_charging ? <BatteryCharging className="w-4 h-4 text-[#44d62c]" /> : <Battery className="w-4 h-4 text-[#8b949e]" />}
                      <span className="text-sm font-bold">{selectedDevice.battery_level}%</span>
                    </div>
                  )}
                </div>

                {/* Control Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Lighting Card */}
                  <div className={`p-6 rounded-2xl border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-[#44d62c]/10 rounded-lg">
                        <Palette className="w-5 h-5 text-[#44d62c]" />
                      </div>
                      <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>Lighting Effects</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-[#8b949e] uppercase mb-3 block">Static Color</label>
                        <div className="flex flex-wrap gap-3">
                          {['#44d62c', '#ff0000', '#0000ff', '#ffffff', '#ff00ff', '#ffff00'].map((color) => (
                            <button
                              key={color}
                              onClick={() => setAccentColor(color)}
                              className={`w-10 h-10 rounded-lg border-2 transition-transform hover:scale-110 ${accentColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          <button className={`w-10 h-10 rounded-lg border-2 border-dashed ${isDark ? 'border-[#30363d] hover:border-[#8b949e]' : 'border-[#d0d7de] hover:border-[#57606a]'} flex items-center justify-center`}>
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-xs font-bold text-[#8b949e] uppercase">Brightness</label>
                          <span className="text-xs font-mono font-bold text-[#44d62c]">{brightness}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={brightness}
                          onChange={(e) => setBrightness(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-[#30363d] rounded-lg appearance-none cursor-pointer accent-[#44d62c]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Performance Card */}
                  <div className={`p-6 rounded-2xl border ${isDark ? 'border-[#30363d] bg-[#161b22]' : 'border-[#d0d7de] bg-white'} shadow-sm`}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-[#44d62c]/10 rounded-lg">
                        <Activity className="w-5 h-5 text-[#44d62c]" />
                      </div>
                      <h3 className={`font-bold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>Performance</h3>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-bold text-[#8b949e] uppercase mb-3 block">Polling Rate</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['125Hz', '500Hz', '1000Hz', '8000Hz'].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => setPollRate(rate)}
                              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                                pollRate === rate 
                                  ? 'bg-[#44d62c] text-black border-[#44d62c]' 
                                  : `${isDark ? 'bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-[#8b949e]' : 'bg-[#f6f8fa] border-[#d0d7de] text-[#57606a] hover:border-[#57606a]'}`
                              }`}
                            >
                              {rate}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#0d1117] border-[#30363d]' : 'bg-[#f6f8fa] border-[#d0d7de]'}`}>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#8b949e] mb-2">
                          <Zap className="w-3 h-3" />
                          LOW LATENCY MODE
                        </div>
                        <p className="text-[10px] leading-relaxed text-[#8b949e]">
                          High polling rates increase CPU usage but provide the smoothest cursor movement and lowest input lag.
                        </p>
                      </div>
                    </div>
                  </div>
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
