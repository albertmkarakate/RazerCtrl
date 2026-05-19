import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/MacroEditor.module.css';

export function MacroEditor() {
  const [macros, setMacros] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentEvents, setCurrentEvents] = useState([]);
  const socketRef = useRef(null);

  const startRecording = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const WS_URL = API_URL.replace('http', 'ws') + '/ws/macro-record';
    
    socketRef.current = new WebSocket(WS_URL);
    
    socketRef.current.onopen = () => {
      setIsRecording(true);
      setCurrentEvents([]);
    };
    
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === 'recording') {
        setCurrentEvents(prev => [...prev, ...data.events]);
      } else if (data.status === 'finished') {
        // Handle full sequence
        console.log('Recording finished:', data.events);
      }
    };
    
    socketRef.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      setIsRecording(false);
    };
  };

  const stopRecording = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ command: 'stop' }));
      setIsRecording(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3>Your Macros</h3>
        <div className={styles.macroList}>
          {macros.length === 0 ? (
            <div className={styles.empty}>No macros saved</div>
          ) : (
            macros.map(m => (
              <div key={m.id} className={styles.macroItem}>{m.name}</div>
            ))
          )}
        </div>
      </div>

      <div className={styles.editor}>
        <div className={styles.controls}>
          {!isRecording ? (
            <button className={styles.recordBtn} onClick={startRecording}>Start Recording</button>
          ) : (
            <button className={styles.stopBtn} onClick={stopRecording}>Stop Recording</button>
          )}
        </div>

        <div className={styles.timeline}>
          {currentEvents.length === 0 ? (
            <div className={styles.timelineEmpty}>
              {isRecording ? 'Waiting for input...' : 'Start recording to capture keystrokes'}
            </div>
          ) : (
            <div className={styles.eventStream}>
              {currentEvents.map((ev, i) => (
                <div key={i} className={`${styles.eventChip} ${ev.value === 1 ? styles.keyDown : styles.keyUp}`}>
                  <span className={styles.keyCode}>{ev.code}</span>
                  <span className={styles.keyAction}>{ev.value === 1 ? 'DOWN' : 'UP'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
