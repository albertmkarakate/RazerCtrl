import logging
import json
import os
import re
from typing import Dict, List, Optional
from pathlib import Path
from .config import PROFILES_DIR, ensure_dirs


def _safe_filename(name: str) -> str:
    """Sanitize a profile name so it is safe as a filename component.

    Only alphanumeric characters, hyphens, underscores, and spaces are
    allowed.  Everything else is stripped.  The result is also verified to
    resolve inside PROFILES_DIR to prevent path traversal.
    """
    sanitized = re.sub(r'[^a-zA-Z0-9 _\-]', '', name).strip()
    if not sanitized:
        raise ValueError(f"Invalid profile name: {name!r}")
    # Double-check that the resolved path stays inside PROFILES_DIR
    resolved = (PROFILES_DIR / f"{sanitized}.json").resolve()
    if not str(resolved).startswith(str(PROFILES_DIR.resolve())):
        raise ValueError(f"Profile name would escape the profiles directory: {name!r}")
    return sanitized


class ProfileManager:
    """
    Manages loading, saving, and applying device profiles.
    """
    def __init__(self, device_manager):
        self.device_manager = device_manager
        self.profiles: Dict[str, dict] = {}
        self.current_profile_name: Optional[str] = None
        self.load_all_profiles()

    def load_all_profiles(self):
        """Loads all profiles from the profiles directory."""
        if not PROFILES_DIR.exists():
            return

        for profile_file in PROFILES_DIR.glob("*.json"):
            try:
                with open(profile_file, 'r') as f:
                    profile_data = json.load(f)
                    name = profile_data.get("name", profile_file.stem)
                    self.profiles[name] = profile_data
            except Exception as e:
                logging.error(f"Failed to load profile {profile_file}: {e}")

    def save_profile(self, name: str, data: dict):
        """Saves a profile to a JSON file."""
        ensure_dirs()
        safe_name = _safe_filename(name)
        data["name"] = safe_name
        self.profiles[safe_name] = data
        
        file_path = PROFILES_DIR / f"{safe_name}.json"
        try:
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=4)
        except Exception as e:
            logging.error(f"Failed to save profile {safe_name}: {e}")

    def delete_profile(self, name: str):
        """Deletes a profile from memory and from disk."""
        if name in self.profiles:
            del self.profiles[name]
        try:
            safe_name = _safe_filename(name)
            file_path = PROFILES_DIR / f"{safe_name}.json"
            if file_path.exists():
                file_path.unlink()
        except (ValueError, OSError) as e:
            logging.error(f"Failed to delete profile file for {name}: {e}")

    def apply_profile(self, name: str):
        """Applies a profile's settings to the connected devices."""
        if name not in self.profiles:
            logging.warning(f"Profile {name} not found.")
            return

        profile_data = self.profiles[name]
        device_settings = profile_data.get("devices", {})

        for serial, settings in device_settings.items():
            device = self.device_manager.get_device_by_serial(serial)
            if device:
                self._apply_device_settings(device, settings)
        
        self.current_profile_name = name

    def _apply_device_settings(self, device, settings):
        """Applies specific settings to a single device."""
        # Lighting
        lighting = settings.get("lighting", {})
        effect = lighting.get("effect")
        if effect:
            try:
                # This is a simplified example, actual implementation would map effect names to methods
                if effect == "static":
                    color = lighting.get("color", [0, 255, 0])
                    device.fx.static(*color)
                elif effect == "none":
                    device.fx.none()
                # ... other effects
            except Exception as e:
                logging.error(f"Failed to apply lighting to {device.name}: {e}")

        # DPI (for mice)
        if hasattr(device, 'dpi'):
            dpi = settings.get("performance", {}).get("dpi")
            if dpi:
                try:
                    device.dpi = dpi
                except Exception as e:
                    logging.error(f"Failed to set DPI for {device.name}: {e}")
