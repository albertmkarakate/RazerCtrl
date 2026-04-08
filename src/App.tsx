/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Terminal, Github, Download, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-[#1f6feb] selection:text-white">
      {/* Header */}
      <header className="border-bottom border-[#30363d] bg-[#161b22] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#44d62c] rounded-lg flex items-center justify-center shadow-lg shadow-[#44d62c]/20">
            <Terminal className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">RazerCtrl</h1>
            <p className="text-xs text-[#44d62c] font-medium uppercase tracking-widest">C.T.R.L Edition</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded-md transition-all text-sm font-medium"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md transition-all text-sm font-medium shadow-md shadow-[#238636]/10">
            <Download className="w-4 h-4" />
            Download ZIP
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            The Ultimate <span className="text-[#44d62c]">C.T.R.L</span> Manager for Linux
          </h2>
          <p className="text-lg text-[#8b949e] max-w-2xl mx-auto leading-relaxed">
            A production-ready Python application built with PyQt6, OpenRazer, and evdev. 
            Manage lighting, performance, and input mapping with the new Razer-inspired branding.
          </p>
        </motion.div>

        {/* Info Banner */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 mb-12 flex items-start gap-4 shadow-sm">
          <div className="p-2 bg-[#1f6feb]/10 rounded-lg">
            <Info className="text-[#58a6ff] w-6 h-6" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Desktop Application Notice</h3>
            <p className="text-sm text-[#8b949e] leading-relaxed">
              This is a native Linux desktop application. The source code is generated and available in the file explorer. 
              To run it, you'll need a Linux environment with the <code>openrazer</code> daemon installed.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <FeatureCard 
            title="Device Management" 
            description="Full control over lighting effects, DPI stages, and power settings via openrazer-daemon."
            icon={<CheckCircle2 className="text-[#44d62c]" />}
          />
          <FeatureCard 
            title="Input Mapping" 
            description="Advanced key remapping and macro support using evdev and virtual uinput devices."
            icon={<CheckCircle2 className="text-[#44d62c]" />}
          />
          <FeatureCard 
            title="Profile System" 
            description="Save and switch between multiple configurations automatically based on active applications."
            icon={<CheckCircle2 className="text-[#44d62c]" />}
          />
          <FeatureCard 
            title="Universal Installer" 
            description="Distro-aware installer supporting Arch, Fedora, and Debian-based distributions."
            icon={<CheckCircle2 className="text-[#44d62c]" />}
          />
        </div>

        {/* Installation Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Terminal className="text-[#44d62c] w-6 h-6" />
            Installation
          </h3>
          <div className="bg-[#0d1117] rounded-xl border border-[#30363d] p-6 font-mono text-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#8b949e]"># One-line installation</span>
              <button className="text-[#44d62c] hover:underline">Copy</button>
            </div>
            <div className="text-white">
              <span className="text-[#44d62c]">$</span> git clone https://github.com/user/razerctrl.git<br/>
              <span className="text-[#44d62c]">$</span> cd razerctrl<br/>
              <span className="text-[#44d62c]">$</span> bash install.sh
            </div>
            <div className="mt-6 pt-6 border-t border-[#30363d] text-[#8b949e]">
              <p>The installer automatically detects your distro, installs system dependencies, 
                 sets up the 'plugdev' group, and enables the openrazer-daemon.</p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="border-t border-[#30363d] pt-12">
          <h3 className="text-center text-[#8b949e] font-semibold uppercase tracking-widest text-sm mb-8">Built With</h3>
          <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
            <TechItem name="Python 3.10+" />
            <TechItem name="PyQt6" />
            <TechItem name="OpenRazer" />
            <TechItem name="evdev" />
            <TechItem name="uinput" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] bg-[#0d1117] py-8 text-center">
        <p className="text-sm text-[#8b949e]">
          &copy; 2026 RazerCtrl Project. Licensed under MIT.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl hover:border-[#30363d] transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h4 className="text-white font-bold">{title}</h4>
      </div>
      <p className="text-sm text-[#8b949e] leading-relaxed">{description}</p>
    </motion.div>
  );
}

function TechItem({ name }: { name: string }) {
  return (
    <div className="px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-full text-sm font-mono text-[#58a6ff]">
      {name}
    </div>
  );
}
