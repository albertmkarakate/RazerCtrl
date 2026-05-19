import React, { useState, useEffect } from 'react';
import { setPerformance, fetchDeviceState } from '../api';
import styles from '../styles/PerformancePanel.module.css';

export function PerformancePanel({ device }) {
  const [state, setState] = useState({
    dpi_x: 800,
    dpi_y: 800,
    poll_rate: 1000,
    xy_locked: true
  });

  useEffect(() => {
    const loadState = async () => {
      try {
        const data = await fetchDeviceState(device.id);
        if (data.dpi) {
          setState(prev => ({ 
            ...prev, 
            dpi_x: data.dpi[0], 
            dpi_y: data.dpi[1],
            xy_locked: data.dpi[0] === data.dpi[1]
          }));
        }
        if (data.poll_rate) {
          setState(prev => ({ ...prev, poll_rate: data.poll_rate }));
        }
      } catch (err) {
        console.error('Failed to load device state:', err);
      }
    };
    if (device) loadState();
  }, [device]);

  const handleApply = async () => {
    try {
      await setPerformance({
        serial: device.id,
        dpi_x: state.dpi_x,
        dpi_y: state.xy_locked ? state.dpi_x : state.dpi_y,
        poll_rate: state.poll_rate
      });
    } catch (err) {
      alert('Failed to apply performance settings');
    }
  };

  if (!device?.capabilities?.has_dpi && !device?.capabilities?.has_poll_rate) {
    return <div className={styles.unsupported}>Performance settings not available for this device.</div>;
  }

  return (
    <div className={styles.container}>
      {device.capabilities.has_dpi && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Sensitivity (DPI)</h3>
            <button 
              className={`${styles.lockButton} ${state.xy_locked ? styles.locked : ''}`}
              onClick={() => setState({ ...state, xy_locked: !state.xy_locked })}
            >
              {state.xy_locked ? 'Unlock X/Y' : 'Lock X/Y'}
            </button>
          </div>
          
          <div className={styles.dpiControl}>
            <div className={styles.sliderWrapper}>
              <label>X-Axis</label>
              <input 
                type="range" 
                min="100" 
                max={device.capabilities.max_dpi || 20000} 
                step="50"
                value={state.dpi_x}
                onChange={(e) => setState({ ...state, dpi_x: parseInt(e.target.value) })}
              />
              <input 
                type="number" 
                value={state.dpi_x}
                onChange={(e) => setState({ ...state, dpi_x: parseInt(e.target.value) })}
              />
            </div>

            {!state.xy_locked && (
              <div className={styles.sliderWrapper}>
                <label>Y-Axis</label>
                <input 
                  type="range" 
                  min="100" 
                  max={device.capabilities.max_dpi || 20000} 
                  step="50"
                  value={state.dpi_y}
                  onChange={(e) => setState({ ...state, dpi_y: parseInt(e.target.value) })}
                />
                <input 
                  type="number" 
                  value={state.dpi_y}
                  onChange={(e) => setState({ ...state, dpi_y: parseInt(e.target.value) })}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {device.capabilities.has_poll_rate && (
        <div className={styles.section}>
          <h3>Polling Rate</h3>
          <div className={styles.pollGrid}>
            {[125, 250, 500, 1000, 2000, 4000, 8000].map(rate => (
              <button
                key={rate}
                className={`${styles.pollButton} ${state.poll_rate === rate ? styles.activePoll : ''}`}
                onClick={() => setState({ ...state, poll_rate: rate })}
              >
                {rate}Hz
              </button>
            ))}
          </div>
        </div>
      )}

      <button className={styles.applyButton} onClick={handleApply}>
        Apply Settings
      </button>
    </div>
  );
}
