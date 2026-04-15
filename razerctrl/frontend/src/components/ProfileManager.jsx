import React, { useState, useEffect, useRef } from 'react';
import { fetchProfiles, saveProfile, deleteProfile } from '../api';
import styles from '../styles/ProfileManager.module.css';

export function ProfileManager() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const data = await fetchProfiles();
        setProfiles(data);
      } catch (err) {
        console.error('Failed to load profiles');
      }
    };
    loadProfiles();
  }, []);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      
      if (!imported.name || !imported.data) {
        alert('Invalid profile format');
        return;
      }

      await saveProfile(imported.name, imported.data);
      setProfiles([...profiles, imported.name]);
      alert(`Profile "${imported.name}" imported successfully`);
    } catch (err) {
      alert('Failed to import profile: ' + err.message);
    }
    e.target.value = '';
  };

  const handleApply = async (name) => {
    try {
      const res = await fetch(`http://localhost:8000/api/profiles/${name}/apply`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to apply');
      alert(`Profile "${name}" applied successfully`);
    } catch (err) {
      alert('Failed to apply profile');
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Delete profile "${name}"?`)) return;
    try {
      await deleteProfile(name);
      setProfiles(profiles.filter(p => p !== name));
    } catch (err) {
      alert('Failed to delete profile');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Saved Profiles</h3>
        <button className={styles.importBtn} onClick={() => fileInputRef.current?.click()}>
          Import Profile
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={handleImport}
        />
      </div>

      <div className={styles.profileGrid}>
        {profiles.length === 0 ? (
          <div className={styles.empty}>No profiles saved yet.</div>
        ) : (
          profiles.map(name => (
            <div key={name} className={styles.profileCard}>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>{name}</span>
                <span className={styles.profileMeta}>Modified: Just now</span>
              </div>
              <div className={styles.actions}>
                <button className={styles.applyBtn} onClick={() => handleApply(name)}>Apply</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(name)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
