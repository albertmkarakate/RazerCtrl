import React, { useState, useEffect } from 'react';
import { fetchProfiles, saveProfile, deleteProfile } from '../api';
import styles from '../styles/ProfileManager.module.css';

export function ProfileManager() {
  const [profiles, setProfiles] = useState([]);

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
        <button className={styles.importBtn}>Import Profile</button>
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
                <button className={styles.applyBtn}>Apply</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(name)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
