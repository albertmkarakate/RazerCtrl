import React from 'react';
import { Mouse, Keyboard, Headphones, Gamepad, Grid } from 'lucide-react';
import styles from '../styles/DeviceSidebar.module.css';

const IconMap = {
  mouse: Mouse,
  keyboard: Keyboard,
  headset: Headphones,
  gamepad: Gamepad,
  keypad: Grid,
  other: Mouse
};

export function DeviceSidebar({ devices, selectedDevice, onSelect }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.title}>Devices</div>
      <div className={styles.deviceList}>
        {devices.length === 0 ? (
          <div className={styles.empty}>No devices found</div>
        ) : (
          devices.map(device => {
            const Icon = IconMap[device.type] || IconMap.other;
            const isSelected = selectedDevice?.id === device.id;
            
            return (
              <button
                key={device.id}
                className={`${styles.deviceItem} ${isSelected ? styles.selected : ''}`}
                onClick={() => onSelect(device)}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={20} color={isSelected ? '#00ff41' : '#888'} />
                  <div className={styles.pulseDot} />
                </div>
                <div className={styles.deviceInfo}>
                  <span className={styles.name}>{device.name}</span>
                  <span className={styles.type}>{device.type}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
