import React, { useState, useEffect } from 'react';
import { fetchPresets, savePreset } from '../api';
import styles from '../styles/RemapPanel.module.css';

const MOUSE_BUTTONS = [
  { id: 'BTN_LEFT', label: 'Left Click', x: 40, y: 30 },
  { id: 'BTN_RIGHT', label: 'Right Click', x: 60, y: 30 },
  { id: 'BTN_MIDDLE', label: 'Scroll Click', x: 50, y: 25 },
  { id: 'BTN_SIDE1', label: 'Side Button 1', x: 30, y: 50 },
  { id: 'BTN_SIDE2', label: 'Side Button 2', x: 30, y: 60 },
];

export function RemapPanel({ device }) {
  const [presets, setPresets] = useState([]);
  const [activePreset, setActivePreset] = useState('');
  const [mappings, setMappings] = useState([]);
  const [selectedButton, setSelectedButton] = useState(null);
  const [isInjecting, setIsInjecting] = useState(false);

  useEffect(() => {
    const loadPresets = async () => {
      try {
        const data = await fetchPresets(device.name);
        setPresets(data);
      } catch (err) {
        console.error('Failed to load presets');
      }
    };
    if (device) loadPresets();
  }, [device]);

  const handleSave = async () => {
    const presetName = prompt('Enter preset name:', activePreset || 'Default');
    if (!presetName) return;
    
    try {
      await savePreset({
        device_name: device.name,
        preset_name: presetName,
        mappings: mappings
      });
      setActivePreset(presetName);
      setIsInjecting(true);
    } catch (err) {
      alert('Failed to save preset');
    }
  };

  const updateMapping = (buttonId, output) => {
    const newMappings = mappings.filter(m => m.name !== buttonId);
    if (output) {
      newMappings.push({
        name: buttonId,
        input_combination: [{ type: 1, code: 272, analog_threshold: null }], // Simplified
        output_symbol: output,
        output_type: 1
      });
    }
    setMappings(newMappings);
    setSelectedButton(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.presetSelect}>
          <label>Preset:</label>
          <select value={activePreset} onChange={(e) => setActivePreset(e.target.value)}>
            <option value="">Select Preset</option>
            {presets.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <button className={styles.saveButton} onClick={handleSave}>Save & Activate</button>
        <div className={`${styles.status} ${isInjecting ? styles.active : ''}`}>
          {isInjecting ? 'Remapping Active' : 'Remapping Inactive'}
        </div>
      </div>

      <div className={styles.visualizer}>
        <svg viewBox="0 0 100 120" className={styles.deviceSvg}>
          {/* Generic Mouse Body */}
          <path d="M30,20 Q50,10 70,20 L75,80 Q75,110 50,110 Q25,110 25,80 Z" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
          
          {MOUSE_BUTTONS.map(btn => (
            <g key={btn.id} onClick={() => setSelectedButton(btn)} className={styles.hotspot}>
              <circle 
                cx={btn.x} cy={btn.y} r="3" 
                fill={selectedButton?.id === btn.id ? '#00ff41' : '#333'} 
                stroke="#00ff41" strokeWidth={selectedButton?.id === btn.id ? "1" : "0"}
              />
              <text x={btn.x + 5} y={btn.y + 2} fontSize="3" fill="#888">{btn.label}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className={styles.mappingGrid}>
        <h3>Button Mappings</h3>
        <div className={styles.grid}>
          {MOUSE_BUTTONS.map(btn => {
            const mapping = mappings.find(m => m.name === btn.id);
            return (
              <div key={btn.id} className={styles.gridItem}>
                <span className={styles.btnLabel}>{btn.label}</span>
                <span className={styles.assignment}>{mapping ? mapping.output_symbol : 'Default'}</span>
                <button className={styles.editBtn} onClick={() => setSelectedButton(btn)}>Edit</button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedButton && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Assign {selectedButton.label}</h3>
            <div className={styles.modalBody}>
              <p>Press a key or select a function:</p>
              <div className={styles.quickAssign}>
                {['KEY_A', 'KEY_B', 'KEY_C', 'KEY_ENTER', 'KEY_SPACE', 'KEY_BACKSPACE'].map(key => (
                  <button key={key} onClick={() => updateMapping(selectedButton.id, key)}>{key.replace('KEY_', '')}</button>
                ))}
              </div>
              <button className={styles.cancelBtn} onClick={() => setSelectedButton(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
