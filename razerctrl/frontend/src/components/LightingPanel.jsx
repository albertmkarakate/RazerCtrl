import React, { useState } from 'react';
import { setLighting } from '../api';
import styles from '../styles/LightingPanel.module.css';

const EFFECTS = [
  { id: 'static', name: 'Static', icon: 'â—' },
  { id: 'breath', name: 'Breathing', icon: 'â—' },
  { id: 'wave', name: 'Wave', icon: 'â‰ˆ' },
  { id: 'ripple', name: 'Ripple', icon: 'â—Ž' },
  { id: 'reactive', name: 'Reactive', icon: 'âœ¨' },
  { id: 'spectrum', name: 'Spectrum', icon: 'â— ' },
  { id: 'starlight', name: 'Starlight', icon: 'âœœ' },
  { id: 'none', name: 'Off', icon: 'âœ˜' }
];

export function LightingPanel({ device }) {
  const [config, setConfig] = useState({
    effect: 'static',
    colour_hex: '#00ff41',
    speed: 2,
    direction: 'right'
  });

  const handleUpdate = async (updates) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    try {
      await setLighting({
        serial: device.id,
        zone: 'matrix',
        ...newConfig
      });
    } catch (err) {
      console.error('Failed to update lighting:', err);
    }
  };

  if (!device?.capabilities?.has_lighting) {
    return <div className={styles.unsupported}>Lighting not supported on this device.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.effectsGrid}>
        {EFFECTS.map(effect => (
          <button
            key={effect.id}
            className={`${styles.effectCard} ${config.effect === effect.id ? styles.activeEffect : ''}`}
            onClick={() => handleUpdate({ effect: effect.id })}
          >
            <span className={styles.effectIcon}>{effect.icon}</span>
            <span className={styles.effectName}>{effect.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>Colour</label>
          <input 
            type="color" 
            value={config.colour_hex} 
            onChange={(e) => handleUpdate({ colour_hex: e.target.value })}
            className={styles.colorPicker}
          />
        </div>

        {config.effect === 'wave' && (
          <div className={styles.controlGroup}>
            <label>Direction</label>
            <div className={styles.toggleGroup}>
              <button 
                className={config.direction === 'left' ? styles.activeToggle : ''}
                onClick={() => handleUpdate({ direction: 'left' })}
              >
                Left
              </button>
              <button 
                className={config.direction === 'right' ? styles.activeToggle : ''}
                onClick={() => handleUpdate({ direction: 'right' })}
              >
                Right
              </button>
            </div>
          </div>
        )}

        {['reactive', 'wave', 'breath'].includes(config.effect) && (
          <div className={styles.controlGroup}>
            <label>Speed</label>
            <input 
              type="range" 
              min="1" max="3" step="1"
              value={config.speed}
              onChange={(e) => handleUpdate({ speed: parseInt(e.target.value) })}
              className={styles.slider}
            />
          </div>
        )}
      </div>
    </div>
  );
}
