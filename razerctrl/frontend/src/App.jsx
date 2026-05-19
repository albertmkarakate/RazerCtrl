import React, { useState, useEffect } from 'react';
import { DeviceSidebar } from './components/DeviceSidebar';
import { LightingPanel } from './components/LightingPanel';
import { PerformancePanel } from './components/PerformancePanel';
import { RemapPanel } from './components/RemapPanel';
import { MacroEditor } from './components/MacroEditor';
import { ProfileManager } from './components/ProfileManager';
import { fetchDevices } from './api';
import styles from './styles/App.module.css';

export default function App() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeTab, setActiveTab] = useState('lighting');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const data = await fetchDevices();
        setDevices(data);
        if (data.length > 0) setSelectedDevice(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadDevices();
  }, []);

  if (loading) return <div className={styles.loading}>Initializing RazerCtrl...</div>;
  if (error) return <div className={styles.errorBanner}>Error: {error}</div>;

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>RazerCtrl</div>
        {selectedDevice && (
          <div className={styles.deviceInfo}>
            <span className={styles.deviceName}>{selectedDevice.name}</span>
            <span className={styles.statusBadge}>Connected</span>
          </div>
        )}
      </header>

      <main className={styles.main}>
        <DeviceSidebar 
          devices={devices} 
          selectedDevice={selectedDevice} 
          onSelect={setSelectedDevice} 
        />

        <div className={styles.contentArea}>
          <nav className={styles.tabs}>
            {['lighting', 'performance', 'remap', 'macros', 'profiles'].map(tab => (
              <button 
                key={tab}
                className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <section className={styles.panel}>
            {activeTab === 'lighting' && <LightingPanel device={selectedDevice} />}
            {activeTab === 'performance' && <PerformancePanel device={selectedDevice} />}
            {activeTab === 'remap' && <RemapPanel device={selectedDevice} />}
            {activeTab === 'macros' && <MacroEditor />}
            {activeTab === 'profiles' && <ProfileManager />}
          </section>
        </div>
      </main>
    </div>
  );
}
